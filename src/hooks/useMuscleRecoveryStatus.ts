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

      // Fetch the most recent workout for each muscle group from junction table
      const { data: recentMuscles, error: musclesError } = await supabase
        .from('exercise_set_muscles')
        .select(`
          muscle_group,
          exercise_sets!inner(
            workout_logs!inner(completed_at)
          )
        `)
        .order('created_at', { ascending: false });

      if (musclesError) throw musclesError;

      // Group by muscle and get most recent date
      const muscleLastWorked: Record<string, Date> = {};
      recentMuscles?.forEach(muscle => {
        if (!muscleLastWorked[muscle.muscle_group]) {
          const exerciseSet = muscle.exercise_sets as unknown as { workout_logs: { completed_at: string } };
          muscleLastWorked[muscle.muscle_group] = new Date(exerciseSet.workout_logs.completed_at);
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
