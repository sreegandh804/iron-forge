import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CustomProgram {
  id: string;
  name: string;
  description: string | null;
  days_per_week: number;
  created_at: string;
}

export interface CustomProgramWorkout {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  day_label: string | null;
  exercises: unknown;
  sort_order: number;
  created_at: string;
}

export const useCustomPrograms = () => {
  const queryClient = useQueryClient();

  const programsQuery = useQuery({
    queryKey: ['custom-programs'],
    queryFn: async (): Promise<CustomProgram[]> => {
      const { data, error } = await supabase
        .from('custom_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createProgram = useMutation({
    mutationFn: async (program: { name: string; description?: string; days_per_week: number }) => {
      const { data, error } = await supabase
        .from('custom_programs')
        .insert(program)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-programs'] });
      toast.success('Program created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create program: ' + error.message);
    },
  });

  const deleteProgram = useMutation({
    mutationFn: async (programId: string) => {
      const { error } = await supabase
        .from('custom_programs')
        .delete()
        .eq('id', programId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-programs'] });
      toast.success('Program deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete program: ' + error.message);
    },
  });

  return {
    programs: programsQuery.data || [],
    isLoading: programsQuery.isLoading,
    createProgram,
    deleteProgram,
  };
};

export const useCustomProgramWorkouts = (programId: string | null) => {
  const queryClient = useQueryClient();

  const workoutsQuery = useQuery({
    queryKey: ['custom-program-workouts', programId],
    queryFn: async (): Promise<CustomProgramWorkout[]> => {
      if (!programId) return [];
      
      const { data, error } = await supabase
        .from('custom_program_workouts')
        .select('*')
        .eq('program_id', programId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!programId,
  });

  const createWorkout = useMutation({
    mutationFn: async (workout: {
      program_id: string;
      title: string;
      description?: string;
      day_label?: string;
      exercises: any[];
    }) => {
      const { data, error } = await supabase
        .from('custom_program_workouts')
        .insert(workout)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-program-workouts'] });
      toast.success('Workout added');
    },
    onError: (error) => {
      toast.error('Failed to add workout: ' + error.message);
    },
  });

  const deleteWorkout = useMutation({
    mutationFn: async (workoutId: string) => {
      const { error } = await supabase
        .from('custom_program_workouts')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-program-workouts'] });
      toast.success('Workout deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete workout: ' + error.message);
    },
  });

  return {
    workouts: workoutsQuery.data || [],
    isLoading: workoutsQuery.isLoading,
    createWorkout,
    deleteWorkout,
  };
};
