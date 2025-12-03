import { useState } from "react";
import { Workout, ExerciseSet } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ExerciseLoggerProps {
  workout: Workout;
  onBack: () => void;
}

export function ExerciseLogger({ workout, onBack }: ExerciseLoggerProps) {
  const [sets, setSets] = useState<Record<string, ExerciseSet[]>>({});
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

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

  const finishWorkout = () => {
    const totalSets = Object.values(sets).flat().filter(s => s.completed).length;
    toast.success(`Workout complete! ${totalSets} sets logged.`);
    onBack();
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

      <div className="space-y-4">
        {workout.exercises.map((exercise, index) => {
          const exerciseSets = sets[exercise.id] || [];
          const isActive = activeExercise === exercise.id;
          
          return (
            <NeuCard
              key={exercise.id}
              variant={isActive ? "pressed" : "raised"}
              className="cursor-pointer"
              onClick={() => setActiveExercise(isActive ? null : exercise.id)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-muted text-muted-foreground w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-border">
                      {index + 1}
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
      </div>

      <NeuButton variant="default" size="lg" className="w-full" onClick={finishWorkout}>
        <Check className="h-5 w-5 mr-2" />
        Finish Workout
      </NeuButton>
    </section>
  );
}
