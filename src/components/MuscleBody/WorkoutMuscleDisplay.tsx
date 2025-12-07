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
  // Completed exercises get frequency 2 (green), pending get frequency 1 (amber)
  const buildMuscleData = () => {
    const result: any[] = [];
    
    exercises.forEach(ex => {
      const isCompleted = completedExerciseIds.includes(ex.id);
      const isActive = ex.id === activeExerciseId;
      
      // Use all muscle targets if available, otherwise fall back to primary muscleGroup
      const muscles = ex.muscleTargets && ex.muscleTargets.length > 0
        ? ex.muscleTargets.map(mt => mt.name)
        : [ex.muscleGroup];
      
      result.push({
        name: ex.name,
        muscles: musclesToSlugs(muscles) as any[],
        // Active gets highest priority (3), completed (2), pending (1)
        frequency: isActive ? 3 : (isCompleted ? 2 : 1),
      });
    });
    
    return result;
  };

  const completedCount = completedExerciseIds.length;
  const totalCount = exercises.length;

  return (
    <NeuCard className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
        <h3 className="font-bold uppercase text-sm tracking-wide">Muscles Targeted</h3>
      </div>

      {/* Front View */}
      <div className="neu-pressed p-3 bg-muted/20 mb-3">
        <span className="text-xs font-bold uppercase text-muted-foreground mb-2 block text-center">Front</span>
        <Model
          data={buildMuscleData()}
          style={{ width: '100%', padding: '0.5rem' }}
          type="anterior"
          bodyColor="#374151"
          highlightedColors={[
            '#F97316', // frequency 1 = Pending (orange)
            '#22C55E', // frequency 2 = Done (green)
            '#3B82F6', // frequency 3 = Active (blue)
          ]}
        />
      </div>

      {/* Back View */}
      <div className="neu-pressed p-3 bg-muted/20">
        <span className="text-xs font-bold uppercase text-muted-foreground mb-2 block text-center">Back</span>
        <Model
          data={buildMuscleData()}
          style={{ width: '100%', padding: '0.5rem' }}
          type="posterior"
          bodyColor="#374151"
          highlightedColors={[
            '#F97316', // frequency 1 = Pending (orange)
            '#22C55E', // frequency 2 = Done (green)
            '#3B82F6', // frequency 3 = Active (blue)
          ]}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }} />
          <span className="text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
          <span className="text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22C55E' }} />
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
            className="h-full transition-all duration-300"
            style={{ 
              width: `${(completedCount / totalCount) * 100}%`,
              backgroundColor: '#22C55E'
            }}
          />
        </div>
      </div>
    </NeuCard>
  );
}
