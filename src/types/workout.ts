export type ProgramType = 'full-body' | 'ppl' | 'upper-lower';

export interface Equipment {
  id: string;
  name: string;
  category: 'machine' | 'free-weight' | 'cardio' | 'cable' | 'bodyweight';
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
