-- Add availability columns to equipment table
ALTER TABLE public.equipment ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE public.equipment ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Insert default gym equipment using gen_random_uuid()
DO $$
DECLARE
  eq_barbell_id uuid;
  eq_dumbbells_id uuid;
  eq_bench_press_id uuid;
  eq_squat_rack_id uuid;
  eq_lat_pulldown_id uuid;
  eq_cable_machine_id uuid;
  eq_leg_press_id uuid;
  eq_smith_machine_id uuid;
  eq_pull_up_bar_id uuid;
  eq_treadmill_id uuid;
  ex_id uuid;
  mg_id uuid;
BEGIN
  -- Insert equipment and get their IDs
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Barbell', 'free-weight', true, true) RETURNING id INTO eq_barbell_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Dumbbells', 'free-weight', true, true) RETURNING id INTO eq_dumbbells_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Bench Press', 'machine', true, true) RETURNING id INTO eq_bench_press_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Squat Rack', 'free-weight', true, true) RETURNING id INTO eq_squat_rack_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Lat Pulldown', 'cable', true, true) RETURNING id INTO eq_lat_pulldown_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Cable Machine', 'cable', true, true) RETURNING id INTO eq_cable_machine_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Leg Press', 'machine', true, true) RETURNING id INTO eq_leg_press_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Smith Machine', 'machine', true, true) RETURNING id INTO eq_smith_machine_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Pull-up Bar', 'bodyweight', true, true) RETURNING id INTO eq_pull_up_bar_id;
  
  INSERT INTO public.equipment (name, category, is_default, is_available) 
  VALUES ('Treadmill', 'cardio', true, true) RETURNING id INTO eq_treadmill_id;

  -- Insert exercises and link to muscle groups
  -- Barbell Squat
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Barbell Squat', eq_squat_rack_id, 'Compound lower body exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Quadriceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Glutes';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Bench Press
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Bench Press', eq_bench_press_id, 'Compound chest exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Chest';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Triceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Barbell Row
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Barbell Row', eq_barbell_id, 'Compound back exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Upper Back';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Biceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Overhead Press
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Overhead Press', eq_barbell_id, 'Compound shoulder exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Shoulders';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Triceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Romanian Deadlift
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Romanian Deadlift', eq_barbell_id, 'Hip hinge for hamstrings') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Hamstrings';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Glutes';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Deadlift
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Deadlift', eq_barbell_id, 'Compound full body exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Lower Back';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Hamstrings';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Incline Dumbbell Press
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Incline Dumbbell Press', eq_dumbbells_id, 'Upper chest exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Chest';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Shoulders';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Lat Pulldown
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Lat Pulldown', eq_lat_pulldown_id, 'Back exercise for lats') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Lats';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Biceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Leg Press
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Leg Press', eq_leg_press_id, 'Machine exercise for quads') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Quadriceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Glutes';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Cable Flyes
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Cable Flyes', eq_cable_machine_id, 'Isolation chest exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Chest';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;

  -- Tricep Pushdowns
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Tricep Pushdowns', eq_cable_machine_id, 'Tricep isolation') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Triceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;

  -- Pull-ups
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Pull-ups', eq_pull_up_bar_id, 'Bodyweight back exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Lats';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Biceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Barbell Curls
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Barbell Curls', eq_barbell_id, 'Bicep isolation') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Biceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;

  -- Dumbbell Rows
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Dumbbell Rows', eq_dumbbells_id, 'Unilateral back exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Upper Back';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Biceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Lateral Raises
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Lateral Raises', eq_dumbbells_id, 'Shoulder isolation') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Shoulders';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;

  -- Leg Curls
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Leg Curls', eq_leg_press_id, 'Hamstring isolation') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Hamstrings';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;

  -- Calf Raises
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Calf Raises', eq_smith_machine_id, 'Calf isolation') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Calves';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;

  -- Face Pulls
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Face Pulls', eq_cable_machine_id, 'Rear delt exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Upper Back';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Shoulders';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

  -- Lunges
  INSERT INTO public.custom_exercises (name, equipment_id, description) 
  VALUES ('Lunges', eq_dumbbells_id, 'Unilateral leg exercise') RETURNING id INTO ex_id;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Quadriceps';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'primary'); END IF;
  SELECT id INTO mg_id FROM public.muscle_groups WHERE name = 'Glutes';
  IF mg_id IS NOT NULL THEN INSERT INTO public.exercise_muscle_targets (exercise_id, muscle_group_id, target_type) VALUES (ex_id, mg_id, 'secondary'); END IF;

END $$;