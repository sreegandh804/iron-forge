export type ProgramType = 'full-body' | 'ppl' | 'upper-lower' | 'custom';

export type BodyRegion = 'upper-body' | 'lower-body' | 'core';

export interface MuscleGroup {
  id: string;
  name: string;
  bodyRegion: BodyRegion;
}

export interface CustomExercise {
  id: string;
  equipmentId: string;
  name: string;
  description?: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
}

export interface Equipment {
  id: string;
  name: string;
  category: 'machine' | 'free-weight' | 'cardio' | 'cable' | 'bodyweight';
  exercises?: CustomExercise[];
  isAvailable?: boolean;
  isDefault?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  equipmentId?: string;
  muscleGroup: string;
}

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  programType: ProgramType;
  exercises: Exercise[];
  day?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  workoutId: string;
  sets: ExerciseSet[];
}
