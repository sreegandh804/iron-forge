import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroup, BodyRegion } from "@/types/workout";

export function useMuscleGroups() {
  return useQuery({
    queryKey: ["muscle-groups"],
    queryFn: async (): Promise<MuscleGroup[]> => {
      const { data, error } = await supabase
        .from("muscle_groups")
        .select("*")
        .order("name");

      if (error) throw error;

      return data.map((mg) => ({
        id: mg.id,
        name: mg.name,
        bodyRegion: mg.body_region as BodyRegion,
      }));
    },
  });
}
