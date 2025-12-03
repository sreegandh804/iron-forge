import { Workout, Equipment } from '@/types/workout';

export const defaultEquipment: Equipment[] = [
  { id: '1', name: 'Barbell', category: 'free-weight' },
  { id: '2', name: 'Dumbbells', category: 'free-weight' },
  { id: '3', name: 'Bench Press', category: 'machine' },
  { id: '4', name: 'Squat Rack', category: 'free-weight' },
  { id: '5', name: 'Lat Pulldown', category: 'cable' },
  { id: '6', name: 'Cable Machine', category: 'cable' },
  { id: '7', name: 'Leg Press', category: 'machine' },
  { id: '8', name: 'Smith Machine', category: 'machine' },
  { id: '9', name: 'Pull-up Bar', category: 'bodyweight' },
  { id: '10', name: 'Treadmill', category: 'cardio' },
];

export const workoutPrograms: Workout[] = [
  // Full Body Workouts
  {
    id: 'fb-1',
    title: 'Full Body A',
    description: 'Compound-focused full body workout',
    programType: 'full-body',
    day: 'Day 1',
    exercises: [
      { id: 'e1', name: 'Barbell Squat', equipmentId: '4', muscleGroup: 'Legs' },
      { id: 'e2', name: 'Bench Press', equipmentId: '3', muscleGroup: 'Chest' },
      { id: 'e3', name: 'Barbell Row', equipmentId: '1', muscleGroup: 'Back' },
      { id: 'e4', name: 'Overhead Press', equipmentId: '1', muscleGroup: 'Shoulders' },
      { id: 'e5', name: 'Romanian Deadlift', equipmentId: '1', muscleGroup: 'Hamstrings' },
    ],
  },
  {
    id: 'fb-2',
    title: 'Full Body B',
    description: 'Variation day with different movement patterns',
    programType: 'full-body',
    day: 'Day 2',
    exercises: [
      { id: 'e6', name: 'Deadlift', equipmentId: '1', muscleGroup: 'Back' },
      { id: 'e7', name: 'Incline Dumbbell Press', equipmentId: '2', muscleGroup: 'Chest' },
      { id: 'e8', name: 'Lat Pulldown', equipmentId: '5', muscleGroup: 'Back' },
      { id: 'e9', name: 'Leg Press', equipmentId: '7', muscleGroup: 'Legs' },
      { id: 'e10', name: 'Lateral Raises', equipmentId: '2', muscleGroup: 'Shoulders' },
    ],
  },
  // PPL Workouts
  {
    id: 'ppl-push',
    title: 'Push Day',
    description: 'Chest, shoulders, and triceps focus',
    programType: 'ppl',
    day: 'Push',
    exercises: [
      { id: 'e11', name: 'Bench Press', equipmentId: '3', muscleGroup: 'Chest' },
      { id: 'e12', name: 'Overhead Press', equipmentId: '1', muscleGroup: 'Shoulders' },
      { id: 'e13', name: 'Incline Dumbbell Press', equipmentId: '2', muscleGroup: 'Upper Chest' },
      { id: 'e14', name: 'Cable Flyes', equipmentId: '6', muscleGroup: 'Chest' },
      { id: 'e15', name: 'Tricep Pushdowns', equipmentId: '6', muscleGroup: 'Triceps' },
    ],
  },
  {
    id: 'ppl-pull',
    title: 'Pull Day',
    description: 'Back and biceps focus',
    programType: 'ppl',
    day: 'Pull',
    exercises: [
      { id: 'e16', name: 'Deadlift', equipmentId: '1', muscleGroup: 'Back' },
      { id: 'e17', name: 'Pull-ups', equipmentId: '9', muscleGroup: 'Back' },
      { id: 'e18', name: 'Barbell Row', equipmentId: '1', muscleGroup: 'Back' },
      { id: 'e19', name: 'Face Pulls', equipmentId: '6', muscleGroup: 'Rear Delts' },
      { id: 'e20', name: 'Barbell Curls', equipmentId: '1', muscleGroup: 'Biceps' },
    ],
  },
  {
    id: 'ppl-legs',
    title: 'Leg Day',
    description: 'Quads, hamstrings, and calves focus',
    programType: 'ppl',
    day: 'Legs',
    exercises: [
      { id: 'e21', name: 'Barbell Squat', equipmentId: '4', muscleGroup: 'Quads' },
      { id: 'e22', name: 'Romanian Deadlift', equipmentId: '1', muscleGroup: 'Hamstrings' },
      { id: 'e23', name: 'Leg Press', equipmentId: '7', muscleGroup: 'Legs' },
      { id: 'e24', name: 'Leg Curls', equipmentId: '7', muscleGroup: 'Hamstrings' },
      { id: 'e25', name: 'Calf Raises', equipmentId: '8', muscleGroup: 'Calves' },
    ],
  },
  // Upper Lower
  {
    id: 'ul-upper',
    title: 'Upper Body',
    description: 'Complete upper body workout',
    programType: 'upper-lower',
    day: 'Upper',
    exercises: [
      { id: 'e26', name: 'Bench Press', equipmentId: '3', muscleGroup: 'Chest' },
      { id: 'e27', name: 'Barbell Row', equipmentId: '1', muscleGroup: 'Back' },
      { id: 'e28', name: 'Overhead Press', equipmentId: '1', muscleGroup: 'Shoulders' },
      { id: 'e29', name: 'Lat Pulldown', equipmentId: '5', muscleGroup: 'Back' },
      { id: 'e30', name: 'Dumbbell Curls', equipmentId: '2', muscleGroup: 'Biceps' },
    ],
  },
  {
    id: 'ul-lower',
    title: 'Lower Body',
    description: 'Complete lower body workout',
    programType: 'upper-lower',
    day: 'Lower',
    exercises: [
      { id: 'e31', name: 'Barbell Squat', equipmentId: '4', muscleGroup: 'Quads' },
      { id: 'e32', name: 'Romanian Deadlift', equipmentId: '1', muscleGroup: 'Hamstrings' },
      { id: 'e33', name: 'Leg Press', equipmentId: '7', muscleGroup: 'Legs' },
      { id: 'e34', name: 'Walking Lunges', equipmentId: '2', muscleGroup: 'Legs' },
      { id: 'e35', name: 'Calf Raises', equipmentId: '8', muscleGroup: 'Calves' },
    ],
  },
];
