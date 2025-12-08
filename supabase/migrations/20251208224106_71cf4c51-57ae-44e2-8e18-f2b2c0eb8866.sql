-- Add Cable Woodchopper custom exercise
INSERT INTO custom_exercises (name, equipment_id, description, user_id)
VALUES ('Cable Woodchopper', '73a40beb-6668-489a-90d4-96a4297aa664', 'Rotational core exercise using cable machine', 'd017f179-47d1-4a22-bd41-864e516616b2')
ON CONFLICT DO NOTHING;

-- Get the exercise ID and add muscle targets
DO $$
DECLARE
  exercise_id UUID;
  abs_muscle_id UUID := '39eefaaa-71ad-4952-88e2-74391732a838';
  obliques_muscle_id UUID := 'fa903edc-5e1f-4ad5-86be-cc5d4ebad651';
BEGIN
  -- Get the exercise ID
  SELECT id INTO exercise_id FROM custom_exercises WHERE name = 'Cable Woodchopper' LIMIT 1;
  
  IF exercise_id IS NOT NULL THEN
    -- Add primary muscle target (Abs)
    INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id)
    VALUES (exercise_id, abs_muscle_id, 'primary', 'd017f179-47d1-4a22-bd41-864e516616b2')
    ON CONFLICT DO NOTHING;
    
    -- Add secondary muscle target (Obliques)
    INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id)
    VALUES (exercise_id, obliques_muscle_id, 'secondary', 'd017f179-47d1-4a22-bd41-864e516616b2')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Add 3x10 15kg Cable Woodchopper sets to today's Legs Day workout
INSERT INTO exercise_sets (workout_log_id, exercise_name, muscle_group, weight, reps, set_number, user_id)
VALUES 
  ('19a26ead-aff5-4103-b693-af929ff8999f', 'Cable Woodchopper', 'Abs', 15, 10, 100, 'd017f179-47d1-4a22-bd41-864e516616b2'),
  ('19a26ead-aff5-4103-b693-af929ff8999f', 'Cable Woodchopper', 'Abs', 15, 10, 101, 'd017f179-47d1-4a22-bd41-864e516616b2'),
  ('19a26ead-aff5-4103-b693-af929ff8999f', 'Cable Woodchopper', 'Abs', 15, 10, 102, 'd017f179-47d1-4a22-bd41-864e516616b2');

-- Add muscle targets for the new sets
DO $$
DECLARE
  set_id UUID;
BEGIN
  FOR set_id IN 
    SELECT id FROM exercise_sets 
    WHERE workout_log_id = '19a26ead-aff5-4103-b693-af929ff8999f' 
    AND exercise_name = 'Cable Woodchopper'
  LOOP
    -- Abs as primary
    INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
    VALUES (set_id, 'Abs', 'primary', 'd017f179-47d1-4a22-bd41-864e516616b2')
    ON CONFLICT DO NOTHING;
    
    -- Obliques as secondary
    INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
    VALUES (set_id, 'Obliques', 'secondary', 'd017f179-47d1-4a22-bd41-864e516616b2')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;