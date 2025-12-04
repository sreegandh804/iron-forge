import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddExerciseInput {
  equipmentId: string;
  name: string;
  description?: string;
  primaryMuscleIds: string[];
  secondaryMuscleIds: string[];
}

export function useExercises() {
  const queryClient = useQueryClient();

  const addExercise = useMutation({
    mutationFn: async (input: AddExerciseInput) => {
      // Insert the exercise
      const { data: exercise, error: exerciseError } = await supabase
        .from("custom_exercises")
        .insert({
          equipment_id: input.equipmentId,
          name: input.name,
          description: input.description,
        })
        .select()
        .single();

      if (exerciseError) throw exerciseError;

      // Insert muscle targets
      const targets = [
        ...input.primaryMuscleIds.map((muscleGroupId) => ({
          exercise_id: exercise.id,
          muscle_group_id: muscleGroupId,
          target_type: "primary" as const,
        })),
        ...input.secondaryMuscleIds.map((muscleGroupId) => ({
          exercise_id: exercise.id,
          muscle_group_id: muscleGroupId,
          target_type: "secondary" as const,
        })),
      ];

      if (targets.length > 0) {
        const { error: targetsError } = await supabase
          .from("exercise_muscle_targets")
          .insert(targets);

        if (targetsError) throw targetsError;
      }

      return exercise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  const removeExercise = useMutation({
    mutationFn: async (exerciseId: string) => {
      const { error } = await supabase
        .from("custom_exercises")
        .delete()
        .eq("id", exerciseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  return {
    addExercise,
    removeExercise,
  };
}
