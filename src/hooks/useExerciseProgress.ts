import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type ProgressStatus = 'improving' | 'plateau' | 'regressing' | 'insufficient';

export interface ExerciseProgress {
  exerciseName: string;
  status: ProgressStatus;
  percentChange: number;
  consecutivePlateaus: number;
  recentAvg: number;
  previousAvg: number;
}

export function useExerciseProgress(exerciseNames: string[]) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["exercise-progress", user?.id, exerciseNames],
    queryFn: async (): Promise<Record<string, ExerciseProgress>> => {
      if (!user || exerciseNames.length === 0) return {};

      // Fetch the last 6 workout dates with sets for each exercise
      const { data: sets, error } = await supabase
        .from("exercise_sets")
        .select(`
          exercise_name,
          weight,
          reps,
          workout_log_id,
          workout_logs!inner(completed_at)
        `)
        .eq("user_id", user.id)
        .in("exercise_name", exerciseNames)
        .order("workout_logs(completed_at)", { ascending: false });

      if (error) throw error;

      const progressMap: Record<string, ExerciseProgress> = {};

      for (const exerciseName of exerciseNames) {
        const exerciseSets = sets?.filter(s => s.exercise_name === exerciseName) || [];
        
        // Group by workout date and get max weight per workout
        const workoutMaxWeights = new Map<string, number>();
        
        for (const set of exerciseSets) {
          const workoutId = set.workout_log_id;
          const currentMax = workoutMaxWeights.get(workoutId) || 0;
          if (set.weight > currentMax) {
            workoutMaxWeights.set(workoutId, set.weight);
          }
        }

        const maxWeights = Array.from(workoutMaxWeights.values());

        if (maxWeights.length < 4) {
          progressMap[exerciseName] = {
            exerciseName,
            status: 'insufficient',
            percentChange: 0,
            consecutivePlateaus: 0,
            recentAvg: maxWeights[0] || 0,
            previousAvg: 0,
          };
          continue;
        }

        // Recent 3 vs Previous 3
        const recent3 = maxWeights.slice(0, 3);
        const previous3 = maxWeights.slice(3, 6);

        const recentAvg = recent3.reduce((a, b) => a + b, 0) / recent3.length;
        const previousAvg = previous3.length > 0 
          ? previous3.reduce((a, b) => a + b, 0) / previous3.length 
          : recentAvg;

        const percentChange = previousAvg > 0 
          ? ((recentAvg - previousAvg) / previousAvg) * 100 
          : 0;

        let status: ProgressStatus;
        if (percentChange > 2.5) {
          status = 'improving';
        } else if (percentChange < -2.5) {
          status = 'regressing';
        } else {
          status = 'plateau';
        }

        // Count consecutive plateaus (simplified: check if last 3 workouts had same max weight)
        let consecutivePlateaus = 0;
        if (status === 'plateau' && recent3.length >= 3) {
          const tolerance = recent3[0] * 0.025; // 2.5% tolerance
          const allSimilar = recent3.every(w => Math.abs(w - recent3[0]) <= tolerance);
          if (allSimilar) {
            consecutivePlateaus = 3;
          }
        }

        progressMap[exerciseName] = {
          exerciseName,
          status,
          percentChange,
          consecutivePlateaus,
          recentAvg,
          previousAvg,
        };
      }

      return progressMap;
    },
    enabled: !!user && exerciseNames.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
