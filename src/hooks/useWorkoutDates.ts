import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subMonths, format } from "date-fns";

export function useWorkoutDates() {
  return useQuery({
    queryKey: ["workout-dates"],
    queryFn: async () => {
      const threeMonthsAgo = subMonths(new Date(), 3);
      
      const { data, error } = await supabase
        .from("workout_logs")
        .select("completed_at")
        .gte("completed_at", threeMonthsAgo.toISOString())
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
