import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Equipment, CustomExercise, MuscleGroup, BodyRegion } from "@/types/workout";

export function useEquipment() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["equipment"],
    queryFn: async (): Promise<Equipment[]> => {
      // Fetch equipment
      const { data: equipmentData, error: equipmentError } = await supabase
        .from("equipment")
        .select("*")
        .order("created_at", { ascending: false });

      if (equipmentError) throw equipmentError;

      // Fetch all exercises with their muscle targets
      const { data: exercisesData, error: exercisesError } = await supabase
        .from("custom_exercises")
        .select(`
          *,
          exercise_muscle_targets (
            target_type,
            muscle_group_id,
            muscle_groups (id, name, body_region)
          )
        `);

      if (exercisesError) throw exercisesError;

      // Map exercises to their equipment
      const exercisesByEquipment = new Map<string, CustomExercise[]>();
      
      for (const ex of exercisesData || []) {
        const primaryMuscles: MuscleGroup[] = [];
        const secondaryMuscles: MuscleGroup[] = [];

        for (const target of ex.exercise_muscle_targets || []) {
          const mg = target.muscle_groups as { id: string; name: string; body_region: string } | null;
          if (mg) {
            const muscleGroup: MuscleGroup = {
              id: mg.id,
              name: mg.name,
              bodyRegion: mg.body_region as BodyRegion,
            };
            if (target.target_type === "primary") {
              primaryMuscles.push(muscleGroup);
            } else {
              secondaryMuscles.push(muscleGroup);
            }
          }
        }

        const exercise: CustomExercise = {
          id: ex.id,
          equipmentId: ex.equipment_id,
          name: ex.name,
          description: ex.description || undefined,
          primaryMuscles,
          secondaryMuscles,
        };

        const existing = exercisesByEquipment.get(ex.equipment_id) || [];
        existing.push(exercise);
        exercisesByEquipment.set(ex.equipment_id, existing);
      }

      return equipmentData.map((eq) => ({
        id: eq.id,
        name: eq.name,
        category: eq.category as Equipment["category"],
        exercises: exercisesByEquipment.get(eq.id) || [],
      }));
    },
  });

  const addEquipment = useMutation({
    mutationFn: async (equipment: Omit<Equipment, "id" | "exercises">) => {
      const { data, error } = await supabase
        .from("equipment")
        .insert({
          name: equipment.name,
          category: equipment.category,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  const removeEquipment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipment").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  return {
    equipment: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addEquipment,
    removeEquipment,
  };
}
