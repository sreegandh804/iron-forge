import { useState, useMemo } from "react";
import { Workout, ExerciseSet } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Check, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutMuscleDisplay } from "@/components/MuscleBody/WorkoutMuscleDisplay";

interface ExerciseLoggerProps {
  workout: Workout;
  onBack: () => void;
  onWorkoutComplete?: () => void;
}

export function ExerciseLogger({ workout, onBack, onWorkoutComplete }: ExerciseLoggerProps) {
  const [sets, setSets] = useState<Record<string, ExerciseSet[]>>({});
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Calculate completed exercises (at least one completed set)
  const completedExerciseIds = useMemo(() => {
    return workout.exercises
      .filter(ex => {
        const exerciseSets = sets[ex.id] || [];
        return exerciseSets.some(s => s.completed);
      })
      .map(ex => ex.id);
  }, [sets, workout.exercises]);

  const addSet = (exerciseId: string) => {
    const exerciseSets = sets[exerciseId] || [];
    const lastSet = exerciseSets[exerciseSets.length - 1];
    const newSet: ExerciseSet = {
      id: Date.now().toString(),
      exerciseId,
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 10,
      completed: false,
    };
    setSets({
      ...sets,
      [exerciseId]: [...exerciseSets, newSet],
    });
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    setSets({
      ...sets,
      [exerciseId]: (sets[exerciseId] || []).map((s) =>
        s.id === setId ? { ...s, [field]: value } : s
      ),
    });
  };

  const toggleComplete = (exerciseId: string, setId: string) => {
    setSets({
      ...sets,
      [exerciseId]: (sets[exerciseId] || []).map((s) =>
        s.id === setId ? { ...s, completed: !s.completed } : s
      ),
    });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setSets({
      ...sets,
      [exerciseId]: (sets[exerciseId] || []).filter((s) => s.id !== setId),
    });
  };

  const finishWorkout = async () => {
    const completedSets = Object.entries(sets).flatMap(([exerciseId, exerciseSets]) =>
      exerciseSets.filter(s => s.completed).map(s => ({ ...s, exerciseId }))
    );

    if (completedSets.length === 0) {
      toast.error("Complete at least one set before finishing!");
      return;
    }

    setSaving(true);

    try {
      // Create workout log
      const { data: workoutLog, error: logError } = await supabase
        .from("workout_logs")
        .insert({
          workout_title: workout.title,
          workout_description: workout.description,
          program_type: workout.programType,
        })
        .select()
        .single();

      if (logError) throw logError;

      // Create exercise sets
      const exerciseSetsToInsert = completedSets.map((set, index) => {
        const exercise = workout.exercises.find(e => e.id === set.exerciseId);
        return {
          workout_log_id: workoutLog.id,
          exercise_name: exercise?.name || "Unknown",
          muscle_group: exercise?.muscleGroup || "Unknown",
          weight: set.weight,
          reps: set.reps,
          set_number: index + 1,
        };
      });

      const { error: setsError } = await supabase
        .from("exercise_sets")
        .insert(exerciseSetsToInsert);

      if (setsError) throw setsError;

      const totalVolume = completedSets.reduce((acc, s) => acc + s.weight * s.reps, 0);
      toast.success(`Workout saved! ${completedSets.length} sets, ${totalVolume.toLocaleString()}kg total volume`);
      onWorkoutComplete?.();
      onBack();
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <NeuButton variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </NeuButton>
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">{workout.title}</h2>
          <p className="text-muted-foreground font-mono text-sm">{workout.description}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Exercise List */}
        <div className="flex-1 space-y-4">
          {workout.exercises.map((exercise, index) => {
            const exerciseSets = sets[exercise.id] || [];
            const isActive = activeExercise === exercise.id;
            const isCompleted = completedExerciseIds.includes(exercise.id);
            
            return (
              <NeuCard
                key={exercise.id}
                variant={isActive ? "pressed" : "raised"}
                className={`cursor-pointer ${isCompleted ? 'border-accent' : ''}`}
                onClick={() => setActiveExercise(isActive ? null : exercise.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-border ${
                        isCompleted ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg">{exercise.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono uppercase">
                          {exercise.muscleGroup}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">
                        {exerciseSets.filter(s => s.completed).length}/{exerciseSets.length} sets
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="space-y-3 pt-4 border-t-2 border-border" onClick={(e) => e.stopPropagation()}>
                      {exerciseSets.map((set, setIndex) => (
                        <div
                          key={set.id}
                          className={`flex items-center gap-3 p-3 border-2 border-border ${
                            set.completed ? 'bg-accent' : 'bg-background'
                          }`}
                        >
                          <span className="font-mono text-sm w-8">#{setIndex + 1}</span>
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="number"
                              value={set.weight}
                              onChange={(e) => updateSet(exercise.id, set.id, 'weight', Number(e.target.value))}
                              className="w-20 h-10 text-center font-mono border-2 border-border"
                            />
                            <span className="text-xs text-muted-foreground font-mono">KG</span>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              type="number"
                              value={set.reps}
                              onChange={(e) => updateSet(exercise.id, set.id, 'reps', Number(e.target.value))}
                              className="w-20 h-10 text-center font-mono border-2 border-border"
                            />
                            <span className="text-xs text-muted-foreground font-mono">REPS</span>
                          </div>
                          <NeuButton
                            variant={set.completed ? "default" : "outline"}
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => toggleComplete(exercise.id, set.id)}
                          >
                            <Check className="h-4 w-4" />
                          </NeuButton>
                          <button
                            onClick={() => removeSet(exercise.id, set.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <NeuButton
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => addSet(exercise.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Set
                      </NeuButton>
                    </div>
                  )}
                </div>
              </NeuCard>
            );
          })}

          <NeuButton variant="default" size="lg" className="w-full" onClick={finishWorkout} disabled={saving}>
            {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
            {saving ? "Saving..." : "Finish Workout"}
          </NeuButton>
        </div>

        {/* Muscle Diagram Sidebar */}
        <div className="lg:w-72 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-8">
            <WorkoutMuscleDisplay
              exercises={workout.exercises}
              completedExerciseIds={completedExerciseIds}
              activeExerciseId={activeExercise}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
