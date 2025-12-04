import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExerciseMuscleTargets {
  exerciseId: string;
  primary: string[];
  secondary: string[];
}

export function useExerciseMuscles(exerciseIds: string[]) {
  return useQuery({
    queryKey: ['exercise-muscles', exerciseIds],
    queryFn: async () => {
      if (exerciseIds.length === 0) return {};

      const { data, error } = await supabase
        .from('exercise_muscle_targets')
        .select(`
          exercise_id,
          target_type,
          muscle_groups!inner(name)
        `)
        .in('exercise_id', exerciseIds);

      if (error) throw error;

      const result: Record<string, { primary: string[]; secondary: string[] }> = {};

      data?.forEach((row: any) => {
        const exerciseId = row.exercise_id;
        const muscleName = row.muscle_groups?.name;
        const targetType = row.target_type;

        if (!result[exerciseId]) {
          result[exerciseId] = { primary: [], secondary: [] };
        }

        if (targetType === 'primary' && muscleName) {
          result[exerciseId].primary.push(muscleName);
        } else if (targetType === 'secondary' && muscleName) {
          result[exerciseId].secondary.push(muscleName);
        }
      });

      return result;
    },
    enabled: exerciseIds.length > 0,
  });
}
