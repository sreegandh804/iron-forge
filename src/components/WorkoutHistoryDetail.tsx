import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NeuCard } from "@/components/ui/neu-card";
import { MuscleGroupBadge } from "@/components/MuscleGroupBadge";
import { format } from "date-fns";
import { Calendar, Dumbbell, TrendingUp, Target } from "lucide-react";

interface MuscleTarget {
  muscle_group: string;
  target_type: string;
}

interface ExerciseSet {
  id: string;
  exercise_name: string;
  muscle_group: string;
  weight: number;
  reps: number;
  set_number: number;
  muscle_targets?: MuscleTarget[];
}

interface WorkoutLog {
  id: string;
  workout_title: string;
  workout_description: string | null;
  program_type: string;
  completed_at: string;
}

interface WorkoutHistoryDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout: WorkoutLog | null;
  sets: ExerciseSet[];
}

export function WorkoutHistoryDetail({ open, onOpenChange, workout, sets }: WorkoutHistoryDetailProps) {
  if (!workout) return null;

  // Group sets by exercise
  const exerciseGroups = sets.reduce((acc, set) => {
    if (!acc[set.exercise_name]) {
      // Collect all unique muscles from this exercise's sets
      const allMuscles = new Set<string>();
      const primaryMuscles = new Set<string>();
      const secondaryMuscles = new Set<string>();
      
      acc[set.exercise_name] = {
        muscle_group: set.muscle_group,
        primaryMuscles,
        secondaryMuscles,
        allMuscles,
        sets: [],
      };
    }
    
    // Add muscles from this set's muscle_targets
    if (set.muscle_targets && set.muscle_targets.length > 0) {
      set.muscle_targets.forEach(mt => {
        acc[set.exercise_name].allMuscles.add(mt.muscle_group);
        if (mt.target_type === 'primary') {
          acc[set.exercise_name].primaryMuscles.add(mt.muscle_group);
        } else {
          acc[set.exercise_name].secondaryMuscles.add(mt.muscle_group);
        }
      });
    } else {
      acc[set.exercise_name].allMuscles.add(set.muscle_group);
      acc[set.exercise_name].primaryMuscles.add(set.muscle_group);
    }
    
    acc[set.exercise_name].sets.push(set);
    return acc;
  }, {} as Record<string, { muscle_group: string; primaryMuscles: Set<string>; secondaryMuscles: Set<string>; allMuscles: Set<string>; sets: ExerciseSet[] }>);

  // Calculate totals
  const totalVolume = sets.reduce((acc, set) => acc + Number(set.weight) * set.reps, 0);
  const totalSets = sets.length;
  const exerciseCount = Object.keys(exerciseGroups).length;

  // Calculate volume by muscle group - using all targeted muscles
  const volumeByMuscle = sets.reduce((acc, set) => {
    const volume = Number(set.weight) * set.reps;
    
    if (set.muscle_targets && set.muscle_targets.length > 0) {
      // Add volume to ALL targeted muscles
      set.muscle_targets.forEach(mt => {
        if (!acc[mt.muscle_group]) {
          acc[mt.muscle_group] = 0;
        }
        acc[mt.muscle_group] += volume;
      });
    } else {
      // Fallback to single muscle_group
      if (!acc[set.muscle_group]) {
        acc[set.muscle_group] = 0;
      }
      acc[set.muscle_group] += volume;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {workout.workout_title}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Calendar className="h-4 w-4" />
            {format(new Date(workout.completed_at), "MMMM d, yyyy 'at' h:mm a")}
            <span className="uppercase bg-muted px-2 py-0.5 border border-border ml-2">
              {workout.program_type.replace("-", " ")}
            </span>
          </div>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <NeuCard variant="flat" className="text-center py-3">
            <div className="text-2xl font-bold font-mono">{totalSets}</div>
            <div className="text-xs text-muted-foreground uppercase">Total Sets</div>
          </NeuCard>
          <NeuCard variant="flat" className="text-center py-3">
            <div className="text-2xl font-bold font-mono">{totalVolume.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground uppercase">Volume (kg)</div>
          </NeuCard>
          <NeuCard variant="flat" className="text-center py-3">
            <div className="text-2xl font-bold font-mono">{exerciseCount}</div>
            <div className="text-xs text-muted-foreground uppercase">Exercises</div>
          </NeuCard>
        </div>

        {/* Exercise Breakdown */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Exercise Breakdown
          </h3>
          
          {Object.entries(exerciseGroups).map(([exerciseName, data]) => {
            const exerciseVolume = data.sets.reduce((acc, set) => acc + Number(set.weight) * set.reps, 0);
            const primaryMuscles = Array.from(data.primaryMuscles);
            const secondaryMuscles = Array.from(data.secondaryMuscles);
            
            return (
              <NeuCard key={exerciseName} variant="raised" className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{exerciseName}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {primaryMuscles.map(muscle => (
                        <MuscleGroupBadge key={muscle} name={muscle} type="primary" />
                      ))}
                      {secondaryMuscles.map(muscle => (
                        <MuscleGroupBadge key={muscle} name={muscle} type="secondary" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono">{exerciseVolume.toLocaleString()}kg</div>
                    <div className="text-xs text-muted-foreground">volume</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {data.sets.map((set, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0"
                    >
                      <span className="text-muted-foreground font-mono">Set {set.set_number}</span>
                      <span className="font-mono">
                        {set.weight}kg × {set.reps} reps
                        <span className="text-muted-foreground ml-2">
                          = {(Number(set.weight) * set.reps).toLocaleString()}kg
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </NeuCard>
            );
          })}
        </div>

        {/* Volume by Muscle Group */}
        <div className="mt-6 space-y-3">
          <h3 className="font-bold uppercase text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Volume by Muscle Group
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(volumeByMuscle)
              .sort((a, b) => b[1] - a[1])
              .map(([muscle, volume]) => {
                const percentage = Math.round((volume / totalVolume) * 100);
                return (
                  <div
                    key={muscle}
                    className="flex items-center justify-between p-2 bg-muted/50 border border-border"
                  >
                    <span className="text-sm font-medium">{muscle}</span>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold">{volume.toLocaleString()}kg</span>
                      <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
