import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PersonalRecord {
  exercise_name: string;
  max_weight: number;
  max_reps: number;
}

export function usePersonalRecords() {
  return useQuery({
    queryKey: ["personal-records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_sets")
        .select("exercise_name, weight, reps");

      if (error) throw error;

      // Calculate max weight and max reps per exercise
      const records = new Map<string, PersonalRecord>();
      
      data?.forEach((set) => {
        const existing = records.get(set.exercise_name);
        if (!existing) {
          records.set(set.exercise_name, {
            exercise_name: set.exercise_name,
            max_weight: set.weight,
            max_reps: set.reps,
          });
        } else {
          if (set.weight > existing.max_weight) {
            existing.max_weight = set.weight;
          }
          if (set.reps > existing.max_reps) {
            existing.max_reps = set.reps;
          }
        }
      });

      return records;
    },
  });
}
