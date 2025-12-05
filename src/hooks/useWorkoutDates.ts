import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, format } from "date-fns";

export function useWorkoutDates() {
  return useQuery({
    queryKey: ["workout-dates"],
    queryFn: async () => {
      // Use 400 days to capture seeded historical data from 2024
      const startDate = subDays(new Date(), 400);
      
      const { data, error } = await supabase
        .from("workout_logs")
        .select("completed_at")
        .gte("completed_at", startDate.toISOString())
        .order("completed_at", { ascending: true });

      if (error) throw error;

      // Group by date and count workouts per day
      const dateMap = new Map<string, number>();
      data?.forEach((log) => {
        const dateKey = format(startOfDay(new Date(log.completed_at)), "yyyy-MM-dd");
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      });

      return dateMap;
    },
  });
}
