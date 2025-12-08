import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Workout, Exercise, ProgramType } from "@/types/workout";

interface WorkoutTemplate {
  id: string;
  title: string;
  description: string | null;
  program_type: string;
  day_label: string | null;
  sort_order: number;
  is_system: boolean;
}

interface MuscleTarget {
  name: string;
  type: 'primary' | 'secondary';
}

interface TemplateExercise {
  id: string;
  template_id: string;
  exercise_name: string;
  muscle_group: string;
  equipment_name: string | null;
  sort_order: number;
  muscle_targets: MuscleTarget[] | null;
}

interface UserWorkoutTemplate {
  id: string;
  user_id: string;
  base_template_id: string | null;
  program_type: string;
  title: string;
  description: string | null;
  day_label: string | null;
  exercises: Exercise[];
  sort_order: number;
}

export function useWorkoutTemplates(programType: ProgramType | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch system templates with their exercises
  const { data: systemTemplates, isLoading: loadingSystem } = useQuery({
    queryKey: ["workout-templates", programType],
    queryFn: async () => {
      if (!programType || programType === "custom") return [];

      const { data: templates, error: templatesError } = await supabase
        .from("workout_templates")
        .select("*")
        .eq("program_type", programType)
        .eq("is_system", true)
        .order("sort_order");

      if (templatesError) throw templatesError;
      if (!templates || templates.length === 0) return [];

      const templateIds = templates.map((t) => t.id);
      const { data: exercises, error: exercisesError } = await supabase
        .from("workout_template_exercises")
        .select("*")
        .in("template_id", templateIds)
        .order("sort_order");

      if (exercisesError) throw exercisesError;

      // Map templates to Workout format
      return templates.map((template) => {
        const templateExercises = (exercises || [])
          .filter((e) => e.template_id === template.id)
          .map((e) => ({
            id: e.id,
            name: e.exercise_name,
            muscleGroup: e.muscle_group,
            equipmentName: e.equipment_name,
            muscleTargets: e.muscle_targets || [{ name: e.muscle_group, type: 'primary' as const }],
          }));

        return {
          id: template.id,
          title: template.title,
          description: template.description || "",
          programType: template.program_type as ProgramType,
          day: template.day_label || undefined,
          exercises: templateExercises,
        } as Workout;
      });
    },
    enabled: !!programType && programType !== "custom",
  });

  // Fetch user's custom template overrides
  const { data: userTemplates, isLoading: loadingUser } = useQuery({
    queryKey: ["user-workout-templates", programType, user?.id],
    queryFn: async () => {
      if (!user || !programType || programType === "custom") return [];

      const { data, error } = await supabase
        .from("user_workout_templates")
        .select("*")
        .eq("user_id", user.id)
        .eq("program_type", programType)
        .order("sort_order");

      if (error) throw error;
      
      // Parse JSONB exercises field
      return (data || []).map((t) => ({
        ...t,
        exercises: (t.exercises as unknown as Exercise[]) || [],
      })) as UserWorkoutTemplate[];
    },
    enabled: !!user && !!programType && programType !== "custom",
  });

  // Merge system templates with user overrides
  const workouts: Workout[] = (systemTemplates || []).map((systemWorkout) => {
    const userOverride = (userTemplates || []).find(
      (ut) => ut.base_template_id === systemWorkout.id
    );

    if (userOverride) {
      return {
        id: userOverride.id,
        title: userOverride.title,
        description: userOverride.description || "",
        programType: userOverride.program_type as ProgramType,
        day: userOverride.day_label || undefined,
        exercises: userOverride.exercises,
        isCustomized: true,
        baseTemplateId: userOverride.base_template_id,
      } as Workout & { isCustomized: boolean; baseTemplateId: string };
    }

    return systemWorkout;
  });

  // Save user template customization
  const saveUserTemplate = useMutation({
    mutationFn: async ({
      baseTemplateId,
      title,
      description,
      dayLabel,
      exercises,
      sortOrder,
    }: {
      baseTemplateId: string;
      title: string;
      description?: string;
      dayLabel?: string;
      exercises: Exercise[];
      sortOrder: number;
    }) => {
      if (!user) throw new Error("Must be logged in");
      if (!programType) throw new Error("Program type required");

      // Check if user already has a customization for this template
      const { data: existing } = await supabase
        .from("user_workout_templates")
        .select("id")
        .eq("user_id", user.id)
        .eq("base_template_id", baseTemplateId)
        .maybeSingle();

      const exercisesJson = JSON.parse(JSON.stringify(exercises));

      if (existing) {
        const { error } = await supabase
          .from("user_workout_templates")
          .update({
            title,
            description,
            day_label: dayLabel,
            exercises: exercisesJson,
            sort_order: sortOrder,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_workout_templates").insert({
          user_id: user.id,
          base_template_id: baseTemplateId,
          program_type: programType,
          title,
          description,
          day_label: dayLabel,
          exercises: exercisesJson,
          sort_order: sortOrder,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-workout-templates", programType, user?.id],
      });
    },
  });

  // Reset user template to system default
  const resetUserTemplate = useMutation({
    mutationFn: async (baseTemplateId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("user_workout_templates")
        .delete()
        .eq("user_id", user.id)
        .eq("base_template_id", baseTemplateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-workout-templates", programType, user?.id],
      });
    },
  });

  return {
    workouts,
    systemTemplates: systemTemplates || [],
    isLoading: loadingSystem || loadingUser,
    saveUserTemplate,
    resetUserTemplate,
  };
}
