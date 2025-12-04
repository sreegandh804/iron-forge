import Model from 'react-body-highlighter';
import { NeuCard } from '@/components/ui/neu-card';
import { Activity } from 'lucide-react';
import { Exercise } from '@/types/workout';
import { musclesToSlugs } from './muscleMapping';

interface WorkoutMuscleDisplayProps {
  exercises: Exercise[];
  completedExerciseIds: string[];
  activeExerciseId: string | null;
}

export function WorkoutMuscleDisplay({ 
  exercises, 
  completedExerciseIds, 
  activeExerciseId 
}: WorkoutMuscleDisplayProps) {
  // Build exercise data for the model
  const buildMuscleData = () => {
    const muscleGroups = exercises.map(ex => ex.muscleGroup);
    const completedMuscles = exercises
      .filter(ex => completedExerciseIds.includes(ex.id))
      .map(ex => ex.muscleGroup);
    const activeMuscles = exercises
      .filter(ex => ex.id === activeExerciseId)
      .map(ex => ex.muscleGroup);

    // Create exercise data for the model
    // Completed exercises get frequency 2 (darker), pending get 1
    const data = exercises.map(ex => ({
      name: ex.name,
      muscles: musclesToSlugs([ex.muscleGroup]) as any[],
    }));

    return data;
  };

  // Get color based on completion state
  const getHighlightColor = (muscle: string) => {
    const exercise = exercises.find(ex => 
      musclesToSlugs([ex.muscleGroup]).includes(muscle)
    );
    
    if (!exercise) return 'var(--muted)';
    
    if (completedExerciseIds.includes(exercise.id)) {
      return 'hsl(var(--accent))'; // Completed - green
    }
    if (exercise.id === activeExerciseId) {
      return 'hsl(var(--primary))'; // Active - primary
    }
    return 'hsl(var(--warning))'; // Pending - yellow
  };

  const completedCount = completedExerciseIds.length;
  const totalCount = exercises.length;

  return (
    <NeuCard className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
        <h3 className="font-bold uppercase text-sm tracking-wide">Muscles Targeted</h3>
      </div>

      <div className="neu-pressed p-4 bg-muted/20">
        <Model
          data={buildMuscleData()}
          style={{ width: '100%', padding: '1rem' }}
          highlightedColors={['hsl(var(--warning))', 'hsl(var(--accent))']}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted-foreground">Done</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4 pt-4 border-t-2 border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-muted-foreground">Progress</span>
          <span className="font-bold">{completedCount}/{totalCount}</span>
        </div>
        <div className="mt-2 h-2 bg-muted border-2 border-border">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </NeuCard>
  );
}
