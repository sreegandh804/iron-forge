import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, format, subDays, parseISO } from 'date-fns';

export interface WeightProgression {
  date: string;
  exercise: string;
  muscleGroup: string;
  maxWeight: number;
}

export interface VolumeData {
  week: string;
  totalVolume: number;
  muscleVolumes: Record<string, number>;
}

export interface MuscleFrequency {
  muscle: string;
  count: number;
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
}

export const useWorkoutAnalytics = (days: number = 400) => {
  return useQuery({
    queryKey: ['workout-analytics', days],
    queryFn: async () => {
      // Use 400 days default to capture seeded historical data from 2024
      const startDate = subDays(new Date(), days).toISOString();

      // Fetch all exercise sets within the time period
      const { data: sets, error } = await supabase
        .from('exercise_sets')
        .select('*, workout_logs!inner(completed_at)')
        .gte('workout_logs.completed_at', startDate)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process weight progression by exercise
      const weightByExercise: Record<string, WeightProgression[]> = {};
      sets?.forEach((set: any) => {
        const date = format(parseISO(set.workout_logs.completed_at), 'yyyy-MM-dd');
        const exercise = set.exercise_name;
        
        if (!weightByExercise[exercise]) {
          weightByExercise[exercise] = [];
        }

        const existing = weightByExercise[exercise].find(w => w.date === date);
        if (existing) {
          existing.maxWeight = Math.max(existing.maxWeight, Number(set.weight));
        } else {
          weightByExercise[exercise].push({
            date,
            exercise,
            muscleGroup: set.muscle_group,
            maxWeight: Number(set.weight),
          });
        }
      });

      // Process volume by week
      const volumeByWeek: Record<string, VolumeData> = {};
      sets?.forEach((set: any) => {
        const weekStart = format(startOfWeek(parseISO(set.workout_logs.completed_at), { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const volume = Number(set.weight) * set.reps;
        
        if (!volumeByWeek[weekStart]) {
          volumeByWeek[weekStart] = {
            week: weekStart,
            totalVolume: 0,
            muscleVolumes: {},
          };
        }

        volumeByWeek[weekStart].totalVolume += volume;
        volumeByWeek[weekStart].muscleVolumes[set.muscle_group] = 
          (volumeByWeek[weekStart].muscleVolumes[set.muscle_group] || 0) + volume;
      });

      // Process muscle frequency
      const muscleFrequency: Record<string, number> = {};
      sets?.forEach((set: any) => {
        muscleFrequency[set.muscle_group] = (muscleFrequency[set.muscle_group] || 0) + 1;
      });

      // Find personal records
      const personalRecords: Record<string, PersonalRecord> = {};
      sets?.forEach((set: any) => {
        const exercise = set.exercise_name;
        const weight = Number(set.weight);
        
        if (!personalRecords[exercise] || weight > personalRecords[exercise].weight) {
          personalRecords[exercise] = {
            exercise,
            weight,
            reps: set.reps,
            date: set.workout_logs.completed_at,
          };
        }
      });

      return {
        weightProgression: Object.values(weightByExercise).flat().sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        volumeByWeek: Object.values(volumeByWeek).sort((a, b) => 
          new Date(a.week).getTime() - new Date(b.week).getTime()
        ),
        muscleFrequency: Object.entries(muscleFrequency)
          .map(([muscle, count]) => ({ muscle, count }))
          .sort((a, b) => b.count - a.count),
        personalRecords: Object.values(personalRecords).sort((a, b) => b.weight - a.weight),
      };
    },
  });
};
