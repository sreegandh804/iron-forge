import { useState, useMemo } from "react";
import { Workout, Exercise, ExerciseSet } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { ArrowLeft, Plus, Check, Trash2, Loader2, Minus, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorkoutMuscleDisplay } from "@/components/MuscleBody/WorkoutMuscleDisplay";
import { useLastWorkoutSets } from "@/hooks/useLastWorkoutSets";
import { usePersonalRecords } from "@/hooks/usePersonalRecords";
import { useAuth } from "@/hooks/useAuth";
import { AddExerciseSheet } from "@/components/AddExerciseSheet";

interface ExerciseLoggerProps {
  workout: Workout;
  onBack: () => void;
  onWorkoutComplete?: () => void;
}

export function ExerciseLogger({ workout: initialWorkout, onBack, onWorkoutComplete }: ExerciseLoggerProps) {
  const [workout, setWorkout] = useState<Workout>(initialWorkout);
  const [sets, setSets] = useState<Record<string, ExerciseSet[]>>({});
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPRs, setNewPRs] = useState<Set<string>>(new Set());
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

  const { user } = useAuth();
  const { data: lastWorkoutSets } = useLastWorkoutSets();
  const { data: personalRecords } = usePersonalRecords();

  const existingExerciseIds = useMemo(() => 
    workout.exercises.map(ex => ex.id), 
    [workout.exercises]
  );

  const handleAddExercise = (exercise: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));
    setIsAddExerciseOpen(false);
    toast.success(`Added ${exercise.name}`);
  };

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
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    const lastSet = exerciseSets[exerciseSets.length - 1];
    
    // Get last workout data for this exercise
    const lastWorkout = lastWorkoutSets?.get(exercise?.name || '');
    
    const newSet: ExerciseSet = {
      id: Date.now().toString(),
      exerciseId,
      weight: lastSet?.weight || lastWorkout?.weight || 0,
      reps: lastSet?.reps || lastWorkout?.reps || 10,
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
        s.id === setId ? { ...s, [field]: Math.max(0, value) } : s
      ),
    });
  };

  const incrementValue = (exerciseId: string, setId: string, field: 'weight' | 'reps', increment: number) => {
    const exerciseSets = sets[exerciseId] || [];
    const currentSet = exerciseSets.find(s => s.id === setId);
    if (currentSet) {
      updateSet(exerciseId, setId, field, currentSet[field] + increment);
    }
  };

  const toggleComplete = (exerciseId: string, setId: string) => {
    const exerciseSets = sets[exerciseId] || [];
    const currentSet = exerciseSets.find(s => s.id === setId);
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    
    if (currentSet && !currentSet.completed && exercise) {
      // Check for PR
      const currentPR = personalRecords?.get(exercise.name);
      if (currentPR && currentSet.weight > currentPR.max_weight) {
        toast.success(`🏆 New PR: ${exercise.name} - ${currentSet.weight}kg!`, {
          duration: 5000,
        });
        setNewPRs(prev => new Set(prev).add(exerciseId));
      }
    }

    setSets({
      ...sets,
      [exerciseId]: exerciseSets.map((s) =>
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
      // Create workout log with user_id
      const { data: workoutLog, error: logError } = await supabase
        .from("workout_logs")
        .insert({
          workout_title: workout.title,
          workout_description: workout.description,
          program_type: workout.programType,
          user_id: user?.id,
        })
        .select()
        .single();

      if (logError) throw logError;

      // Create exercise sets with user_id
      const exerciseSetsToInsert = completedSets.map((set, index) => {
        const exercise = workout.exercises.find(e => e.id === set.exerciseId);
        return {
          workout_log_id: workoutLog.id,
          exercise_name: exercise?.name || "Unknown",
          muscle_group: exercise?.muscleGroup || "Unknown",
          weight: set.weight,
          reps: set.reps,
          set_number: index + 1,
          user_id: user?.id,
        };
      });

      const { error: setsError } = await supabase
        .from("exercise_sets")
        .insert(exerciseSetsToInsert);

      if (setsError) throw setsError;

      const totalVolume = completedSets.reduce((acc, s) => acc + s.weight * s.reps, 0);
      const prCount = newPRs.size;
      const prMessage = prCount > 0 ? ` 🏆 ${prCount} new PR${prCount > 1 ? 's' : ''}!` : '';
      toast.success(`Workout saved! ${completedSets.length} sets, ${totalVolume.toLocaleString()}kg total volume${prMessage}`);
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
    <section className="space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <NeuButton variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
            <ArrowLeft className="h-5 w-5" />
          </NeuButton>
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">{workout.title}</h2>
            <p className="text-muted-foreground font-mono text-sm">{workout.description}</p>
          </div>
        </div>
        <NeuButton variant="secondary" onClick={() => setIsAddExerciseOpen(true)} className="h-12">
          <Plus className="h-5 w-5 mr-2" />
          Add Exercise
        </NeuButton>
      </div>

      <AddExerciseSheet
        open={isAddExerciseOpen}
        onOpenChange={setIsAddExerciseOpen}
        onAddExercise={handleAddExercise}
        existingExerciseIds={existingExerciseIds}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Exercise List */}
        <div className="flex-1 space-y-4">
          {workout.exercises.map((exercise, index) => {
            const exerciseSets = sets[exercise.id] || [];
            const isActive = activeExercise === exercise.id;
            const isCompleted = completedExerciseIds.includes(exercise.id);
            const hasPR = newPRs.has(exercise.id);
            const lastWorkout = lastWorkoutSets?.get(exercise.name);
            
            return (
              <NeuCard
                key={exercise.id}
                variant={isActive ? "pressed" : "raised"}
                className={`cursor-pointer ${isCompleted ? 'border-accent' : ''} ${hasPR ? 'ring-2 ring-yellow-500' : ''}`}
                onClick={() => setActiveExercise(isActive ? null : exercise.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 flex items-center justify-center font-bold text-sm border-2 border-border ${
                        isCompleted ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{exercise.name}</h3>
                          {hasPR && <Trophy className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono uppercase">
                          {exercise.muscleGroup}
                        </p>
                        {lastWorkout && !isActive && (
                          <p className="text-xs text-muted-foreground font-mono">
                            Last: {lastWorkout.weight}kg × {lastWorkout.reps}
                          </p>
                        )}
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
                      {lastWorkout && (
                        <div className="text-sm text-muted-foreground font-mono bg-muted/50 p-2 border border-border">
                          Last workout: {lastWorkout.weight}kg × {lastWorkout.reps} reps
                        </div>
                      )}
                      
                      {exerciseSets.map((set, setIndex) => (
                        <div
                          key={set.id}
                          className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border-2 border-border ${
                            set.completed ? 'bg-accent' : 'bg-background'
                          }`}
                        >
                          <span className="font-mono text-sm w-full sm:w-8 text-center sm:text-left">#{setIndex + 1}</span>
                          
                          {/* Weight Input with +/- buttons */}
                          <div className="flex items-center gap-1 flex-1">
                            <NeuButton
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 flex-shrink-0"
                              onClick={() => incrementValue(exercise.id, set.id, 'weight', -2.5)}
                            >
                              <Minus className="h-4 w-4" />
                            </NeuButton>
                            <div className="flex-1 text-center">
                              <input
                                type="number"
                                inputMode="decimal"
                                value={set.weight}
                                onChange={(e) => updateSet(exercise.id, set.id, 'weight', Number(e.target.value))}
                                className="w-full h-12 text-center font-mono text-lg border-2 border-border bg-background"
                              />
                              <span className="text-xs text-muted-foreground font-mono">KG</span>
                            </div>
                            <NeuButton
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 flex-shrink-0"
                              onClick={() => incrementValue(exercise.id, set.id, 'weight', 2.5)}
                            >
                              <Plus className="h-4 w-4" />
                            </NeuButton>
                          </div>
                          
                          {/* Reps Input with +/- buttons */}
                          <div className="flex items-center gap-1 flex-1">
                            <NeuButton
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 flex-shrink-0"
                              onClick={() => incrementValue(exercise.id, set.id, 'reps', -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </NeuButton>
                            <div className="flex-1 text-center">
                              <input
                                type="number"
                                inputMode="numeric"
                                value={set.reps}
                                onChange={(e) => updateSet(exercise.id, set.id, 'reps', Number(e.target.value))}
                                className="w-full h-12 text-center font-mono text-lg border-2 border-border bg-background"
                              />
                              <span className="text-xs text-muted-foreground font-mono">REPS</span>
                            </div>
                            <NeuButton
                              variant="outline"
                              size="icon"
                              className="h-12 w-12 flex-shrink-0"
                              onClick={() => incrementValue(exercise.id, set.id, 'reps', 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </NeuButton>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex gap-2 justify-end">
                            <NeuButton
                              variant={set.completed ? "default" : "outline"}
                              size="icon"
                              className="h-12 w-12"
                              onClick={() => toggleComplete(exercise.id, set.id)}
                            >
                              <Check className="h-5 w-5" />
                            </NeuButton>
                            <button
                              onClick={() => removeSet(exercise.id, set.id)}
                              className="p-3 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <NeuButton
                        variant="secondary"
                        size="lg"
                        className="w-full h-12"
                        onClick={() => addSet(exercise.id)}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Set
                      </NeuButton>
                    </div>
                  )}
                </div>
              </NeuCard>
            );
          })}

          <NeuButton variant="default" size="lg" className="w-full h-14" onClick={finishWorkout} disabled={saving}>
            {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
            {saving ? "Saving..." : "Finish Workout"}
          </NeuButton>
        </div>

        {/* Muscle Diagram Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-72 lg:flex-shrink-0">
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
