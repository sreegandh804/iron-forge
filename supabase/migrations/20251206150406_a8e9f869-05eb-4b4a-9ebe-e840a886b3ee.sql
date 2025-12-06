-- First delete any existing workout data for this user
DELETE FROM exercise_sets WHERE user_id = 'd017f179-47d1-4a22-bd41-864e516616b2';
DELETE FROM workout_logs WHERE user_id = 'd017f179-47d1-4a22-bd41-864e516616b2';

-- Create temporary table to store workout log IDs for reference
DO $$
DECLARE
  wl_ids uuid[];
  i integer;
  workout_dates timestamptz[] := ARRAY[
    '2025-09-15 10:00:00+00', '2025-09-17 10:00:00+00', '2025-09-20 10:00:00+00',
    '2025-09-23 10:00:00+00', '2025-09-26 10:00:00+00', '2025-09-30 10:00:00+00',
    '2025-10-02 10:00:00+00', '2025-10-04 10:00:00+00', '2025-10-07 10:00:00+00',
    '2025-10-10 10:00:00+00', '2025-10-14 10:00:00+00', '2025-10-17 10:00:00+00',
    '2025-10-21 10:00:00+00', '2025-10-24 10:00:00+00', '2025-10-28 10:00:00+00',
    '2025-10-31 10:00:00+00', '2025-11-03 10:00:00+00', '2025-11-06 10:00:00+00',
    '2025-11-10 10:00:00+00', '2025-11-13 10:00:00+00', '2025-11-20 10:00:00+00',
    '2025-11-22 10:00:00+00', '2025-11-24 10:00:00+00', '2025-11-26 10:00:00+00',
    '2025-11-28 10:00:00+00', '2025-11-30 10:00:00+00', '2025-12-01 10:00:00+00',
    '2025-12-02 10:00:00+00', '2025-12-03 10:00:00+00', '2025-12-04 10:00:00+00',
    '2025-12-05 10:00:00+00', '2025-12-06 10:00:00+00'
  ];
  workout_titles text[] := ARRAY[
    'Push Day', 'Pull Day', 'Legs Day', 'Push Day', 'Pull Day', 'Legs Day',
    'Push Day', 'Pull Day', 'Legs Day', 'Push Day', 'Pull Day', 'Legs Day',
    'Push Day', 'Pull Day', 'Legs Day', 'Push Day', 'Pull Day', 'Legs Day',
    'Push Day', 'Pull Day', 'Full Body A', 'Full Body B', 'Full Body A', 'Full Body B',
    'Full Body A', 'Full Body B', 'Full Body A', 'Full Body B', 'Full Body A', 'Full Body B',
    'Full Body A', 'Full Body B'
  ];
  workout_descs text[] := ARRAY[
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Quads, Hamstrings, Calves',
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Quads, Hamstrings, Calves',
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Quads, Hamstrings, Calves',
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Quads, Hamstrings, Calves',
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Quads, Hamstrings, Calves',
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Quads, Hamstrings, Calves',
    'Chest, Shoulders, Triceps', 'Back, Biceps', 'Compound movements focus', 'Accessory focus',
    'Compound movements focus', 'Accessory focus', 'Compound movements focus', 'Accessory focus',
    'Compound movements focus', 'Accessory focus', 'Compound movements focus', 'Accessory focus',
    'Compound movements focus', 'Accessory focus'
  ];
  program_types text[] := ARRAY[
    'ppl', 'ppl', 'ppl', 'ppl', 'ppl', 'ppl',
    'ppl', 'ppl', 'ppl', 'ppl', 'ppl', 'ppl',
    'ppl', 'ppl', 'ppl', 'ppl', 'ppl', 'ppl',
    'ppl', 'ppl', 'full_body', 'full_body', 'full_body', 'full_body',
    'full_body', 'full_body', 'full_body', 'full_body', 'full_body', 'full_body',
    'full_body', 'full_body'
  ];
  uid uuid := 'd017f179-47d1-4a22-bd41-864e516616b2';
  new_id uuid;
BEGIN
  -- Initialize array
  wl_ids := ARRAY[]::uuid[];
  
  -- Insert workout logs and collect IDs
  FOR i IN 1..32 LOOP
    INSERT INTO workout_logs (user_id, workout_title, workout_description, program_type, completed_at)
    VALUES (uid, workout_titles[i], workout_descs[i], program_types[i], workout_dates[i])
    RETURNING id INTO new_id;
    wl_ids := array_append(wl_ids, new_id);
  END LOOP;

  -- Push Day 1 (wl_ids[1]) - Sept 15
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[1], 'Bench Press', 'Chest', 60, 10, 1), (uid, wl_ids[1], 'Bench Press', 'Chest', 60, 8, 2), (uid, wl_ids[1], 'Bench Press', 'Chest', 60, 8, 3),
  (uid, wl_ids[1], 'Overhead Press', 'Shoulders', 30, 10, 1), (uid, wl_ids[1], 'Overhead Press', 'Shoulders', 30, 8, 2),
  (uid, wl_ids[1], 'Tricep Dips', 'Triceps', 0, 12, 1), (uid, wl_ids[1], 'Tricep Dips', 'Triceps', 0, 10, 2);

  -- Pull Day 1 (wl_ids[2]) - Sept 17
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[2], 'Deadlift', 'Back', 80, 8, 1), (uid, wl_ids[2], 'Deadlift', 'Back', 80, 8, 2), (uid, wl_ids[2], 'Deadlift', 'Back', 80, 6, 3),
  (uid, wl_ids[2], 'Barbell Row', 'Back', 50, 10, 1), (uid, wl_ids[2], 'Barbell Row', 'Back', 50, 10, 2),
  (uid, wl_ids[2], 'Bicep Curls', 'Biceps', 12, 12, 1), (uid, wl_ids[2], 'Bicep Curls', 'Biceps', 12, 10, 2);

  -- Legs Day 1 (wl_ids[3]) - Sept 20
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[3], 'Squat', 'Quadriceps', 70, 10, 1), (uid, wl_ids[3], 'Squat', 'Quadriceps', 70, 10, 2), (uid, wl_ids[3], 'Squat', 'Quadriceps', 70, 8, 3),
  (uid, wl_ids[3], 'Leg Press', 'Quadriceps', 100, 12, 1), (uid, wl_ids[3], 'Leg Press', 'Quadriceps', 100, 12, 2),
  (uid, wl_ids[3], 'Calf Raises', 'Calves', 40, 15, 1), (uid, wl_ids[3], 'Calf Raises', 'Calves', 40, 15, 2);

  -- Push Day 2 (wl_ids[4]) - Sept 23
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[4], 'Bench Press', 'Chest', 62.5, 10, 1), (uid, wl_ids[4], 'Bench Press', 'Chest', 62.5, 9, 2), (uid, wl_ids[4], 'Bench Press', 'Chest', 62.5, 8, 3),
  (uid, wl_ids[4], 'Overhead Press', 'Shoulders', 32.5, 10, 1), (uid, wl_ids[4], 'Overhead Press', 'Shoulders', 32.5, 8, 2),
  (uid, wl_ids[4], 'Tricep Dips', 'Triceps', 5, 10, 1), (uid, wl_ids[4], 'Tricep Dips', 'Triceps', 5, 8, 2);

  -- Pull Day 2 (wl_ids[5]) - Sept 26
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[5], 'Deadlift', 'Back', 85, 8, 1), (uid, wl_ids[5], 'Deadlift', 'Back', 85, 8, 2), (uid, wl_ids[5], 'Deadlift', 'Back', 85, 7, 3),
  (uid, wl_ids[5], 'Barbell Row', 'Back', 52.5, 10, 1), (uid, wl_ids[5], 'Barbell Row', 'Back', 52.5, 10, 2),
  (uid, wl_ids[5], 'Bicep Curls', 'Biceps', 14, 12, 1), (uid, wl_ids[5], 'Bicep Curls', 'Biceps', 14, 10, 2);

  -- Legs Day 2 (wl_ids[6]) - Sept 30
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[6], 'Squat', 'Quadriceps', 75, 10, 1), (uid, wl_ids[6], 'Squat', 'Quadriceps', 75, 10, 2), (uid, wl_ids[6], 'Squat', 'Quadriceps', 75, 9, 3),
  (uid, wl_ids[6], 'Leg Press', 'Quadriceps', 110, 12, 1), (uid, wl_ids[6], 'Leg Press', 'Quadriceps', 110, 12, 2),
  (uid, wl_ids[6], 'Calf Raises', 'Calves', 45, 15, 1), (uid, wl_ids[6], 'Calf Raises', 'Calves', 45, 15, 2);

  -- Push Day 3 (wl_ids[7]) - Oct 2
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[7], 'Bench Press', 'Chest', 65, 10, 1), (uid, wl_ids[7], 'Bench Press', 'Chest', 65, 9, 2), (uid, wl_ids[7], 'Bench Press', 'Chest', 65, 8, 3),
  (uid, wl_ids[7], 'Overhead Press', 'Shoulders', 35, 10, 1), (uid, wl_ids[7], 'Overhead Press', 'Shoulders', 35, 9, 2),
  (uid, wl_ids[7], 'Tricep Dips', 'Triceps', 7.5, 10, 1), (uid, wl_ids[7], 'Tricep Dips', 'Triceps', 7.5, 10, 2);

  -- Pull Day 3 (wl_ids[8]) - Oct 4
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[8], 'Deadlift', 'Back', 90, 8, 1), (uid, wl_ids[8], 'Deadlift', 'Back', 90, 8, 2), (uid, wl_ids[8], 'Deadlift', 'Back', 90, 7, 3),
  (uid, wl_ids[8], 'Barbell Row', 'Back', 55, 10, 1), (uid, wl_ids[8], 'Barbell Row', 'Back', 55, 10, 2),
  (uid, wl_ids[8], 'Bicep Curls', 'Biceps', 14, 12, 1), (uid, wl_ids[8], 'Bicep Curls', 'Biceps', 14, 12, 2);

  -- Legs Day 3 (wl_ids[9]) - Oct 7
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[9], 'Squat', 'Quadriceps', 80, 10, 1), (uid, wl_ids[9], 'Squat', 'Quadriceps', 80, 10, 2), (uid, wl_ids[9], 'Squat', 'Quadriceps', 80, 9, 3),
  (uid, wl_ids[9], 'Leg Press', 'Quadriceps', 120, 12, 1), (uid, wl_ids[9], 'Leg Press', 'Quadriceps', 120, 12, 2),
  (uid, wl_ids[9], 'Calf Raises', 'Calves', 50, 15, 1), (uid, wl_ids[9], 'Calf Raises', 'Calves', 50, 15, 2);

  -- Push Day 4 (wl_ids[10]) - Oct 10
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[10], 'Bench Press', 'Chest', 67.5, 10, 1), (uid, wl_ids[10], 'Bench Press', 'Chest', 67.5, 10, 2), (uid, wl_ids[10], 'Bench Press', 'Chest', 67.5, 8, 3),
  (uid, wl_ids[10], 'Overhead Press', 'Shoulders', 37.5, 10, 1), (uid, wl_ids[10], 'Overhead Press', 'Shoulders', 37.5, 8, 2),
  (uid, wl_ids[10], 'Tricep Dips', 'Triceps', 10, 12, 1), (uid, wl_ids[10], 'Tricep Dips', 'Triceps', 10, 10, 2);

  -- Pull Day 4 (wl_ids[11]) - Oct 14
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[11], 'Deadlift', 'Back', 95, 8, 1), (uid, wl_ids[11], 'Deadlift', 'Back', 95, 8, 2), (uid, wl_ids[11], 'Deadlift', 'Back', 95, 8, 3),
  (uid, wl_ids[11], 'Barbell Row', 'Back', 57.5, 10, 1), (uid, wl_ids[11], 'Barbell Row', 'Back', 57.5, 10, 2),
  (uid, wl_ids[11], 'Bicep Curls', 'Biceps', 16, 12, 1), (uid, wl_ids[11], 'Bicep Curls', 'Biceps', 16, 10, 2);

  -- Legs Day 4 (wl_ids[12]) - Oct 17
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[12], 'Squat', 'Quadriceps', 82.5, 10, 1), (uid, wl_ids[12], 'Squat', 'Quadriceps', 82.5, 10, 2), (uid, wl_ids[12], 'Squat', 'Quadriceps', 82.5, 10, 3),
  (uid, wl_ids[12], 'Leg Press', 'Quadriceps', 130, 12, 1), (uid, wl_ids[12], 'Leg Press', 'Quadriceps', 130, 12, 2),
  (uid, wl_ids[12], 'Calf Raises', 'Calves', 55, 15, 1), (uid, wl_ids[12], 'Calf Raises', 'Calves', 55, 15, 2);

  -- Push Day 5 (wl_ids[13]) - Oct 21
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[13], 'Bench Press', 'Chest', 70, 10, 1), (uid, wl_ids[13], 'Bench Press', 'Chest', 70, 9, 2), (uid, wl_ids[13], 'Bench Press', 'Chest', 70, 8, 3),
  (uid, wl_ids[13], 'Overhead Press', 'Shoulders', 40, 10, 1), (uid, wl_ids[13], 'Overhead Press', 'Shoulders', 40, 9, 2),
  (uid, wl_ids[13], 'Tricep Dips', 'Triceps', 12.5, 12, 1), (uid, wl_ids[13], 'Tricep Dips', 'Triceps', 12.5, 10, 2);

  -- Pull Day 5 (wl_ids[14]) - Oct 24
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[14], 'Deadlift', 'Back', 100, 8, 1), (uid, wl_ids[14], 'Deadlift', 'Back', 100, 8, 2), (uid, wl_ids[14], 'Deadlift', 'Back', 100, 7, 3),
  (uid, wl_ids[14], 'Barbell Row', 'Back', 60, 10, 1), (uid, wl_ids[14], 'Barbell Row', 'Back', 60, 10, 2),
  (uid, wl_ids[14], 'Bicep Curls', 'Biceps', 16, 12, 1), (uid, wl_ids[14], 'Bicep Curls', 'Biceps', 16, 12, 2);

  -- Legs Day 5 (wl_ids[15]) - Oct 28
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[15], 'Squat', 'Quadriceps', 85, 10, 1), (uid, wl_ids[15], 'Squat', 'Quadriceps', 85, 10, 2), (uid, wl_ids[15], 'Squat', 'Quadriceps', 85, 9, 3),
  (uid, wl_ids[15], 'Leg Press', 'Quadriceps', 140, 12, 1), (uid, wl_ids[15], 'Leg Press', 'Quadriceps', 140, 12, 2),
  (uid, wl_ids[15], 'Calf Raises', 'Calves', 60, 15, 1), (uid, wl_ids[15], 'Calf Raises', 'Calves', 60, 15, 2);

  -- Push Day 6 (wl_ids[16]) - Oct 31
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[16], 'Bench Press', 'Chest', 72.5, 10, 1), (uid, wl_ids[16], 'Bench Press', 'Chest', 72.5, 10, 2), (uid, wl_ids[16], 'Bench Press', 'Chest', 72.5, 9, 3),
  (uid, wl_ids[16], 'Overhead Press', 'Shoulders', 42.5, 10, 1), (uid, wl_ids[16], 'Overhead Press', 'Shoulders', 42.5, 9, 2),
  (uid, wl_ids[16], 'Tricep Dips', 'Triceps', 15, 12, 1), (uid, wl_ids[16], 'Tricep Dips', 'Triceps', 15, 12, 2);

  -- Pull Day 6 (wl_ids[17]) - Nov 3
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[17], 'Deadlift', 'Back', 105, 8, 1), (uid, wl_ids[17], 'Deadlift', 'Back', 105, 8, 2), (uid, wl_ids[17], 'Deadlift', 'Back', 105, 8, 3),
  (uid, wl_ids[17], 'Barbell Row', 'Back', 62.5, 10, 1), (uid, wl_ids[17], 'Barbell Row', 'Back', 62.5, 10, 2),
  (uid, wl_ids[17], 'Bicep Curls', 'Biceps', 18, 12, 1), (uid, wl_ids[17], 'Bicep Curls', 'Biceps', 18, 10, 2);

  -- Legs Day 6 (wl_ids[18]) - Nov 6
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[18], 'Squat', 'Quadriceps', 87.5, 10, 1), (uid, wl_ids[18], 'Squat', 'Quadriceps', 87.5, 10, 2), (uid, wl_ids[18], 'Squat', 'Quadriceps', 87.5, 10, 3),
  (uid, wl_ids[18], 'Leg Press', 'Quadriceps', 150, 12, 1), (uid, wl_ids[18], 'Leg Press', 'Quadriceps', 150, 12, 2),
  (uid, wl_ids[18], 'Calf Raises', 'Calves', 65, 15, 1), (uid, wl_ids[18], 'Calf Raises', 'Calves', 65, 15, 2);

  -- Push Day 7 (wl_ids[19]) - Nov 10
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[19], 'Bench Press', 'Chest', 75, 10, 1), (uid, wl_ids[19], 'Bench Press', 'Chest', 75, 10, 2), (uid, wl_ids[19], 'Bench Press', 'Chest', 75, 8, 3),
  (uid, wl_ids[19], 'Overhead Press', 'Shoulders', 45, 10, 1), (uid, wl_ids[19], 'Overhead Press', 'Shoulders', 45, 8, 2),
  (uid, wl_ids[19], 'Tricep Dips', 'Triceps', 17.5, 12, 1), (uid, wl_ids[19], 'Tricep Dips', 'Triceps', 17.5, 10, 2);

  -- Pull Day 7 (wl_ids[20]) - Nov 13
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[20], 'Deadlift', 'Back', 110, 8, 1), (uid, wl_ids[20], 'Deadlift', 'Back', 110, 8, 2), (uid, wl_ids[20], 'Deadlift', 'Back', 110, 7, 3),
  (uid, wl_ids[20], 'Barbell Row', 'Back', 65, 10, 1), (uid, wl_ids[20], 'Barbell Row', 'Back', 65, 10, 2),
  (uid, wl_ids[20], 'Bicep Curls', 'Biceps', 18, 12, 1), (uid, wl_ids[20], 'Bicep Curls', 'Biceps', 18, 12, 2);

  -- Full Body A 1 (wl_ids[21]) - Nov 20
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[21], 'Squat', 'Quadriceps', 90, 8, 1), (uid, wl_ids[21], 'Squat', 'Quadriceps', 90, 8, 2), (uid, wl_ids[21], 'Squat', 'Quadriceps', 90, 8, 3),
  (uid, wl_ids[21], 'Bench Press', 'Chest', 77.5, 8, 1), (uid, wl_ids[21], 'Bench Press', 'Chest', 77.5, 8, 2), (uid, wl_ids[21], 'Bench Press', 'Chest', 77.5, 7, 3),
  (uid, wl_ids[21], 'Barbell Row', 'Back', 67.5, 10, 1), (uid, wl_ids[21], 'Barbell Row', 'Back', 67.5, 10, 2);

  -- Full Body B 1 (wl_ids[22]) - Nov 22
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[22], 'Deadlift', 'Back', 112.5, 6, 1), (uid, wl_ids[22], 'Deadlift', 'Back', 112.5, 6, 2), (uid, wl_ids[22], 'Deadlift', 'Back', 112.5, 6, 3),
  (uid, wl_ids[22], 'Overhead Press', 'Shoulders', 47.5, 8, 1), (uid, wl_ids[22], 'Overhead Press', 'Shoulders', 47.5, 8, 2),
  (uid, wl_ids[22], 'Lat Pulldown', 'Back', 55, 12, 1), (uid, wl_ids[22], 'Lat Pulldown', 'Back', 55, 12, 2);

  -- Full Body A 2 (wl_ids[23]) - Nov 24
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[23], 'Squat', 'Quadriceps', 90, 8, 1), (uid, wl_ids[23], 'Squat', 'Quadriceps', 90, 8, 2), (uid, wl_ids[23], 'Squat', 'Quadriceps', 90, 8, 3),
  (uid, wl_ids[23], 'Bench Press', 'Chest', 77.5, 8, 1), (uid, wl_ids[23], 'Bench Press', 'Chest', 77.5, 8, 2), (uid, wl_ids[23], 'Bench Press', 'Chest', 77.5, 8, 3),
  (uid, wl_ids[23], 'Barbell Row', 'Back', 67.5, 10, 1), (uid, wl_ids[23], 'Barbell Row', 'Back', 67.5, 10, 2);

  -- Full Body B 2 (wl_ids[24]) - Nov 26
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[24], 'Deadlift', 'Back', 115, 6, 1), (uid, wl_ids[24], 'Deadlift', 'Back', 115, 6, 2), (uid, wl_ids[24], 'Deadlift', 'Back', 115, 6, 3),
  (uid, wl_ids[24], 'Overhead Press', 'Shoulders', 47.5, 8, 1), (uid, wl_ids[24], 'Overhead Press', 'Shoulders', 47.5, 8, 2),
  (uid, wl_ids[24], 'Lat Pulldown', 'Back', 57.5, 12, 1), (uid, wl_ids[24], 'Lat Pulldown', 'Back', 57.5, 12, 2);

  -- Full Body A 3 (wl_ids[25]) - Nov 28
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[25], 'Squat', 'Quadriceps', 92.5, 8, 1), (uid, wl_ids[25], 'Squat', 'Quadriceps', 92.5, 8, 2), (uid, wl_ids[25], 'Squat', 'Quadriceps', 92.5, 7, 3),
  (uid, wl_ids[25], 'Bench Press', 'Chest', 80, 8, 1), (uid, wl_ids[25], 'Bench Press', 'Chest', 80, 8, 2), (uid, wl_ids[25], 'Bench Press', 'Chest', 80, 7, 3),
  (uid, wl_ids[25], 'Barbell Row', 'Back', 70, 10, 1), (uid, wl_ids[25], 'Barbell Row', 'Back', 70, 10, 2);

  -- Full Body B 3 (wl_ids[26]) - Nov 30
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[26], 'Deadlift', 'Back', 117.5, 6, 1), (uid, wl_ids[26], 'Deadlift', 'Back', 117.5, 6, 2), (uid, wl_ids[26], 'Deadlift', 'Back', 117.5, 5, 3),
  (uid, wl_ids[26], 'Overhead Press', 'Shoulders', 50, 8, 1), (uid, wl_ids[26], 'Overhead Press', 'Shoulders', 50, 7, 2),
  (uid, wl_ids[26], 'Lat Pulldown', 'Back', 60, 12, 1), (uid, wl_ids[26], 'Lat Pulldown', 'Back', 60, 11, 2);

  -- Full Body A 4 (wl_ids[27]) - Dec 1
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[27], 'Squat', 'Quadriceps', 92.5, 8, 1), (uid, wl_ids[27], 'Squat', 'Quadriceps', 92.5, 8, 2), (uid, wl_ids[27], 'Squat', 'Quadriceps', 92.5, 8, 3),
  (uid, wl_ids[27], 'Bench Press', 'Chest', 80, 8, 1), (uid, wl_ids[27], 'Bench Press', 'Chest', 80, 8, 2), (uid, wl_ids[27], 'Bench Press', 'Chest', 80, 8, 3),
  (uid, wl_ids[27], 'Barbell Row', 'Back', 70, 10, 1), (uid, wl_ids[27], 'Barbell Row', 'Back', 70, 10, 2);

  -- Full Body B 4 (wl_ids[28]) - Dec 2
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[28], 'Deadlift', 'Back', 120, 6, 1), (uid, wl_ids[28], 'Deadlift', 'Back', 120, 6, 2), (uid, wl_ids[28], 'Deadlift', 'Back', 120, 6, 3),
  (uid, wl_ids[28], 'Overhead Press', 'Shoulders', 50, 8, 1), (uid, wl_ids[28], 'Overhead Press', 'Shoulders', 50, 8, 2),
  (uid, wl_ids[28], 'Lat Pulldown', 'Back', 60, 12, 1), (uid, wl_ids[28], 'Lat Pulldown', 'Back', 60, 12, 2);

  -- Full Body A 5 (wl_ids[29]) - Dec 3
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[29], 'Squat', 'Quadriceps', 95, 8, 1), (uid, wl_ids[29], 'Squat', 'Quadriceps', 95, 8, 2), (uid, wl_ids[29], 'Squat', 'Quadriceps', 95, 7, 3),
  (uid, wl_ids[29], 'Bench Press', 'Chest', 82.5, 8, 1), (uid, wl_ids[29], 'Bench Press', 'Chest', 82.5, 7, 2), (uid, wl_ids[29], 'Bench Press', 'Chest', 82.5, 7, 3),
  (uid, wl_ids[29], 'Barbell Row', 'Back', 72.5, 10, 1), (uid, wl_ids[29], 'Barbell Row', 'Back', 72.5, 9, 2);

  -- Full Body B 5 (wl_ids[30]) - Dec 4
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[30], 'Deadlift', 'Back', 120, 6, 1), (uid, wl_ids[30], 'Deadlift', 'Back', 120, 6, 2), (uid, wl_ids[30], 'Deadlift', 'Back', 120, 6, 3),
  (uid, wl_ids[30], 'Overhead Press', 'Shoulders', 52.5, 8, 1), (uid, wl_ids[30], 'Overhead Press', 'Shoulders', 52.5, 7, 2),
  (uid, wl_ids[30], 'Lat Pulldown', 'Back', 62.5, 12, 1), (uid, wl_ids[30], 'Lat Pulldown', 'Back', 62.5, 11, 2);

  -- Full Body A 6 (wl_ids[31]) - Dec 5
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[31], 'Squat', 'Quadriceps', 95, 8, 1), (uid, wl_ids[31], 'Squat', 'Quadriceps', 95, 8, 2), (uid, wl_ids[31], 'Squat', 'Quadriceps', 95, 8, 3),
  (uid, wl_ids[31], 'Bench Press', 'Chest', 82.5, 8, 1), (uid, wl_ids[31], 'Bench Press', 'Chest', 82.5, 8, 2), (uid, wl_ids[31], 'Bench Press', 'Chest', 82.5, 8, 3),
  (uid, wl_ids[31], 'Barbell Row', 'Back', 72.5, 10, 1), (uid, wl_ids[31], 'Barbell Row', 'Back', 72.5, 10, 2);

  -- Full Body B 6 (wl_ids[32]) - Dec 6 (today!)
  INSERT INTO exercise_sets (user_id, workout_log_id, exercise_name, muscle_group, weight, reps, set_number) VALUES
  (uid, wl_ids[32], 'Deadlift', 'Back', 125, 6, 1), (uid, wl_ids[32], 'Deadlift', 'Back', 125, 6, 2), (uid, wl_ids[32], 'Deadlift', 'Back', 125, 5, 3),
  (uid, wl_ids[32], 'Overhead Press', 'Shoulders', 52.5, 8, 1), (uid, wl_ids[32], 'Overhead Press', 'Shoulders', 52.5, 8, 2),
  (uid, wl_ids[32], 'Lat Pulldown', 'Back', 65, 12, 1), (uid, wl_ids[32], 'Lat Pulldown', 'Back', 65, 12, 2);
END $$;