import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LastSet {
  exercise_name: string;
  weight: number;
  reps: number;
}

export function useLastWorkoutSets() {
  return useQuery({
    queryKey: ["last-workout-sets"],
    queryFn: async () => {
      // Get the most recent set for each exercise
      const { data, error } = await supabase
        .from("exercise_sets")
        .select(`
          exercise_name,
          weight,
          reps,
          workout_logs!inner(completed_at)
        `)
        .order("workout_logs(completed_at)", { ascending: false });

      if (error) throw error;

      // Group by exercise and get the most recent
      const lastSets = new Map<string, LastSet>();
      
      data?.forEach((set) => {
        if (!lastSets.has(set.exercise_name)) {
          lastSets.set(set.exercise_name, {
            exercise_name: set.exercise_name,
            weight: set.weight,
            reps: set.reps,
          });
        }
      });

      return lastSets;
    },
  });
}
