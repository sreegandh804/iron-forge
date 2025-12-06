import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInHours } from 'date-fns';

export interface MuscleRecoveryStatus {
  muscleId: string;
  name: string;
  lastWorked: Date | null;
  recoveryHours: number;
  recoveryPercent: number;
  status: 'fatigued' | 'recovering' | 'ready';
  hoursRemaining: number;
  hoursSinceWorked: number;
}

export const useMuscleRecoveryStatus = () => {
  return useQuery({
    queryKey: ['muscle-recovery-status'],
    queryFn: async (): Promise<MuscleRecoveryStatus[]> => {
      // Fetch all muscle groups with their recovery times
      const { data: muscleGroups, error: muscleError } = await supabase
        .from('muscle_groups')
        .select('id, name, recovery_hours');

      if (muscleError) throw muscleError;

      // Fetch the most recent workout for each muscle group using workout_logs.completed_at
      const { data: recentSets, error: setsError } = await supabase
        .from('exercise_sets')
        .select('muscle_group, workout_logs!inner(completed_at)')
        .order('workout_logs(completed_at)', { ascending: false });

      if (setsError) throw setsError;

      // Group by muscle and get most recent date
      const muscleLastWorked: Record<string, Date> = {};
      recentSets?.forEach(set => {
        if (!muscleLastWorked[set.muscle_group]) {
          const workoutLog = set.workout_logs as unknown as { completed_at: string };
          muscleLastWorked[set.muscle_group] = new Date(workoutLog.completed_at);
        }
      });

      const now = new Date();

      return muscleGroups.map(muscle => {
        const lastWorked = muscleLastWorked[muscle.name] || null;
        const recoveryHours = muscle.recovery_hours || 48;
        
        let recoveryPercent = 100;
        let hoursRemaining = 0;
        let hoursSinceWorked = 0;

        if (lastWorked) {
          hoursSinceWorked = differenceInHours(now, lastWorked);
          recoveryPercent = Math.min(100, Math.round((hoursSinceWorked / recoveryHours) * 100));
          hoursRemaining = Math.max(0, recoveryHours - hoursSinceWorked);
        }

        let status: 'fatigued' | 'recovering' | 'ready' = 'ready';
        if (recoveryPercent < 30) {
          status = 'fatigued';
        } else if (recoveryPercent < 80) {
          status = 'recovering';
        }

        return {
          muscleId: muscle.id,
          name: muscle.name,
          lastWorked,
          recoveryHours,
          recoveryPercent,
          status,
          hoursRemaining,
          hoursSinceWorked
        };
      });
    },
    refetchInterval: 60000 // Refetch every minute to update recovery status
  });
};
