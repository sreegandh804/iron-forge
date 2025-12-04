import { useState } from 'react';
import { Workout, Exercise } from '@/types/workout';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuButton } from '@/components/ui/neu-button';
import { ArrowLeft, ArrowRight, Plus, X, Check } from 'lucide-react';
import { MuscleGroupBadge } from '@/components/MuscleGroupBadge';
import { AddExerciseSheet } from './AddExerciseSheet';
import Model from 'react-body-highlighter';
import { musclesToSlugs } from './MuscleBody/muscleMapping';

interface WorkoutCustomizerProps {
  workout: Workout;
  onBack: () => void;
  onStart: (customizedWorkout: Workout) => void;
}

export function WorkoutCustomizer({ workout, onBack, onStart }: WorkoutCustomizerProps) {
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises);
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const activeExercises = exercises.filter(ex => !skippedIds.has(ex.id));

  const toggleSkip = (exerciseId: string) => {
    setSkippedIds(prev => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  };

  const addExercise = (exercise: Exercise) => {
    setExercises(prev => [...prev, exercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    setSkippedIds(prev => {
      const next = new Set(prev);
      next.delete(exerciseId);
      return next;
    });
  };

  const handleStart = () => {
    const customizedWorkout: Workout = {
      ...workout,
      exercises: activeExercises,
    };
    onStart(customizedWorkout);
  };

  // Build muscle data for preview
  const muscleData = activeExercises.map(ex => ({
    name: ex.name,
    muscles: musclesToSlugs([ex.muscleGroup]) as any[],
  }));

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <NeuButton variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </NeuButton>
        <div className="flex-1">
          <h2 className="text-2xl font-bold uppercase tracking-tight">{workout.title}</h2>
          <p className="text-muted-foreground font-mono text-sm">Customize your exercises</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Exercise List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase text-sm tracking-wide">Exercises</h3>
            <NeuButton variant="secondary" size="sm" onClick={() => setIsAddSheetOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </NeuButton>
          </div>

          <div className="space-y-2">
            {exercises.map((exercise, index) => {
              const isSkipped = skippedIds.has(exercise.id);
              const isDefault = workout.exercises.some(ex => ex.id === exercise.id);
              
              return (
                <NeuCard
                  key={exercise.id}
                  variant={isSkipped ? "flat" : "raised"}
                  className={`transition-opacity ${isSkipped ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-border ${
                      isSkipped ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className={`font-bold ${isSkipped ? 'line-through text-muted-foreground' : ''}`}>
                        {exercise.name}
                      </h4>
                      <MuscleGroupBadge name={exercise.muscleGroup} type="secondary" />
                    </div>
                    <div className="flex items-center gap-2">
                      <NeuButton
                        variant={isSkipped ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => toggleSkip(exercise.id)}
                      >
                        {isSkipped ? (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Include
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Skip
                          </>
                        )}
                      </NeuButton>
                      {!isDefault && (
                        <NeuButton
                          variant="outline"
                          size="icon"
                          onClick={() => removeExercise(exercise.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </NeuButton>
                      )}
                    </div>
                  </div>
                </NeuCard>
              );
            })}
          </div>
        </div>

        {/* Muscle Preview */}
        <div className="lg:w-72">
          <NeuCard className="p-4">
            <h3 className="font-bold uppercase text-sm tracking-wide mb-4">Muscle Coverage</h3>
            <div className="neu-pressed p-4 bg-muted/20">
              <Model
                data={muscleData}
                style={{ width: '100%', padding: '0.5rem' }}
                highlightedColors={['hsl(var(--primary))']}
              />
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm font-mono text-muted-foreground">
                {activeExercises.length} exercises selected
              </span>
            </div>
          </NeuCard>
        </div>
      </div>

      {/* Start Button */}
      <NeuButton 
        variant="default" 
        size="lg" 
        className="w-full"
        onClick={handleStart}
        disabled={activeExercises.length === 0}
      >
        <ArrowRight className="h-5 w-5 mr-2" />
        Start Workout ({activeExercises.length} exercises)
      </NeuButton>

      <AddExerciseSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onAddExercise={addExercise}
        existingExerciseIds={exercises.map(ex => ex.id)}
      />
    </section>
  );
}
