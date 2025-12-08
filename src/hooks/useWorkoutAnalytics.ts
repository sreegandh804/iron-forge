import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, format, subDays, parseISO } from 'date-fns';

export interface WeightProgression {
  date: string;
  exercise: string;
  muscleGroup: string;
  muscleGroups?: string[]; // All targeted muscles
  maxWeight: number;
}

export interface VolumeData {
  date: string;
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

      // Fetch muscle targets for all sets
      const setIds = sets?.map(s => s.id) || [];
      const { data: muscleTargets, error: muscleError } = await supabase
        .from('exercise_set_muscles')
        .select('exercise_set_id, muscle_group, target_type')
        .in('exercise_set_id', setIds);

      if (muscleError) throw muscleError;

      // Create a map from set_id to all muscle groups
      const setMuscles: Record<string, { muscle_group: string; target_type: string }[]> = {};
      muscleTargets?.forEach(mt => {
        if (!setMuscles[mt.exercise_set_id]) {
          setMuscles[mt.exercise_set_id] = [];
        }
        setMuscles[mt.exercise_set_id].push({ muscle_group: mt.muscle_group, target_type: mt.target_type });
      });

      // Process weight progression by exercise - with all muscle targets
      const weightByExercise: Record<string, WeightProgression[]> = {};
      sets?.forEach((set: any) => {
        const date = format(parseISO(set.workout_logs.completed_at), 'yyyy-MM-dd');
        const exercise = set.exercise_name;
        const muscles = setMuscles[set.id] || [{ muscle_group: set.muscle_group, target_type: 'primary' }];
        const allMuscleGroups = muscles.map(m => m.muscle_group);
        
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
            muscleGroups: allMuscleGroups,
            maxWeight: Number(set.weight),
          });
        }
      });

      // Process volume by day - using all muscle targets
      const volumeByDay: Record<string, VolumeData> = {};
      sets?.forEach((set: any) => {
        const dateStr = format(parseISO(set.workout_logs.completed_at), 'yyyy-MM-dd');
        const volume = Number(set.weight) * set.reps;
        
        if (!volumeByDay[dateStr]) {
          volumeByDay[dateStr] = {
            date: dateStr,
            totalVolume: 0,
            muscleVolumes: {},
          };
        }

        volumeByDay[dateStr].totalVolume += volume;
        
        // Add volume to ALL muscle groups this set targets
        const muscles = setMuscles[set.id] || [{ muscle_group: set.muscle_group, target_type: 'primary' }];
        muscles.forEach(m => {
          volumeByDay[dateStr].muscleVolumes[m.muscle_group] = 
            (volumeByDay[dateStr].muscleVolumes[m.muscle_group] || 0) + volume;
        });
      });

      // Process muscle frequency - count all targeted muscles
      const muscleFrequency: Record<string, number> = {};
      sets?.forEach((set: any) => {
        const muscles = setMuscles[set.id] || [{ muscle_group: set.muscle_group, target_type: 'primary' }];
        muscles.forEach(m => {
          muscleFrequency[m.muscle_group] = (muscleFrequency[m.muscle_group] || 0) + 1;
        });
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
        volumeByDay: Object.values(volumeByDay).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        muscleFrequency: Object.entries(muscleFrequency)
          .map(([muscle, count]) => ({ muscle, count }))
          .sort((a, b) => b.count - a.count),
        personalRecords: Object.values(personalRecords).sort((a, b) => b.weight - a.weight),
      };
    },
  });
};
