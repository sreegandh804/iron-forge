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

      // Use RPC function to get accurate last worked dates per muscle
      const { data: muscleLastWorkedData, error: rpcError } = await supabase
        .rpc('get_muscle_last_worked');

      if (rpcError) throw rpcError;

      // Build lookup map from RPC results
      const muscleLastWorked: Record<string, Date> = {};
      muscleLastWorkedData?.forEach((row: { muscle_group: string; last_worked: string }) => {
        muscleLastWorked[row.muscle_group] = new Date(row.last_worked);
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
