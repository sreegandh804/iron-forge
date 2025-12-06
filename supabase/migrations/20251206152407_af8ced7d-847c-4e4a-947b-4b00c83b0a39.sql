-- Seed exercises for default equipment
-- Using a fixed user_id that matches the seeded workout data
DO $$
DECLARE
  target_user_id uuid := 'd017f179-47d1-4a22-bd41-864e516616b2';
  ex_id uuid;
BEGIN
  -- Barbell exercises (3addb322-834f-4224-b6d5-c02e489164ef)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '3addb322-834f-4224-b6d5-c02e489164ef', 'Barbell Squat', 'Compound leg exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '82b8378c-cf35-49ca-9ea6-f10a46a7c31f', 'primary', target_user_id), -- Quads
    (ex_id, '0a77af88-b4fa-4697-94d6-00cd19ba8fe1', 'secondary', target_user_id), -- Glutes
    (ex_id, '1b3afaa2-854a-4670-9ef2-78a9d38a0499', 'secondary', target_user_id); -- Hamstrings

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '3addb322-834f-4224-b6d5-c02e489164ef', 'Deadlift', 'Full body compound pull', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '13431e9e-ea22-4000-a848-e15a6a82a936', 'primary', target_user_id), -- Back
    (ex_id, '1b3afaa2-854a-4670-9ef2-78a9d38a0499', 'primary', target_user_id), -- Hamstrings
    (ex_id, '0a77af88-b4fa-4697-94d6-00cd19ba8fe1', 'secondary', target_user_id); -- Glutes

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '3addb322-834f-4224-b6d5-c02e489164ef', 'Barbell Row', 'Back compound exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '13431e9e-ea22-4000-a848-e15a6a82a936', 'primary', target_user_id), -- Back
    (ex_id, 'a179c6df-4927-4f1c-837d-b877f3775c80', 'secondary', target_user_id); -- Biceps

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '3addb322-834f-4224-b6d5-c02e489164ef', 'Overhead Press', 'Shoulder press with barbell', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '150dd0d9-49af-4c43-a8c5-c9121d22a4ae', 'primary', target_user_id), -- Shoulders
    (ex_id, 'b78e1fc0-5b6f-4a58-9a15-84ef38b59bf6', 'secondary', target_user_id); -- Triceps

  -- Bench Press machine (dc701109-61aa-4604-bc86-ddf0148608b3)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'dc701109-61aa-4604-bc86-ddf0148608b3', 'Bench Press', 'Chest press on bench', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '4d9225af-b7bb-4a14-a040-8d7e20c012d2', 'primary', target_user_id), -- Chest
    (ex_id, 'b78e1fc0-5b6f-4a58-9a15-84ef38b59bf6', 'secondary', target_user_id), -- Triceps
    (ex_id, '150dd0d9-49af-4c43-a8c5-c9121d22a4ae', 'secondary', target_user_id); -- Shoulders

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'dc701109-61aa-4604-bc86-ddf0148608b3', 'Incline Bench Press', 'Upper chest focus', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '4d9225af-b7bb-4a14-a040-8d7e20c012d2', 'primary', target_user_id), -- Chest
    (ex_id, '150dd0d9-49af-4c43-a8c5-c9121d22a4ae', 'secondary', target_user_id); -- Shoulders

  -- Dumbbells (d823ee0c-7764-47c1-a802-fefbf1969eab)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'd823ee0c-7764-47c1-a802-fefbf1969eab', 'Dumbbell Curl', 'Bicep isolation exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, 'a179c6df-4927-4f1c-837d-b877f3775c80', 'primary', target_user_id); -- Biceps

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'd823ee0c-7764-47c1-a802-fefbf1969eab', 'Dumbbell Lateral Raise', 'Shoulder isolation', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '150dd0d9-49af-4c43-a8c5-c9121d22a4ae', 'primary', target_user_id); -- Shoulders

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'd823ee0c-7764-47c1-a802-fefbf1969eab', 'Dumbbell Lunges', 'Unilateral leg exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '82b8378c-cf35-49ca-9ea6-f10a46a7c31f', 'primary', target_user_id), -- Quads
    (ex_id, '0a77af88-b4fa-4697-94d6-00cd19ba8fe1', 'secondary', target_user_id); -- Glutes

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'd823ee0c-7764-47c1-a802-fefbf1969eab', 'Dumbbell Shoulder Press', 'Overhead press with dumbbells', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '150dd0d9-49af-4c43-a8c5-c9121d22a4ae', 'primary', target_user_id), -- Shoulders
    (ex_id, 'b78e1fc0-5b6f-4a58-9a15-84ef38b59bf6', 'secondary', target_user_id); -- Triceps

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), 'd823ee0c-7764-47c1-a802-fefbf1969eab', 'Dumbbell Row', 'Single arm back exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '13431e9e-ea22-4000-a848-e15a6a82a936', 'primary', target_user_id), -- Back
    (ex_id, 'a179c6df-4927-4f1c-837d-b877f3775c80', 'secondary', target_user_id); -- Biceps

  -- Leg Press (54d7c5e6-3012-49e3-8c4e-fd790ce7e435)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '54d7c5e6-3012-49e3-8c4e-fd790ce7e435', 'Leg Press', 'Machine quad exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '82b8378c-cf35-49ca-9ea6-f10a46a7c31f', 'primary', target_user_id), -- Quads
    (ex_id, '0a77af88-b4fa-4697-94d6-00cd19ba8fe1', 'secondary', target_user_id); -- Glutes

  -- Cable Machine (73a40beb-6668-489a-90d4-96a4297aa664)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '73a40beb-6668-489a-90d4-96a4297aa664', 'Cable Fly', 'Chest isolation', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '4d9225af-b7bb-4a14-a040-8d7e20c012d2', 'primary', target_user_id); -- Chest

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '73a40beb-6668-489a-90d4-96a4297aa664', 'Tricep Pushdown', 'Tricep isolation', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, 'b78e1fc0-5b6f-4a58-9a15-84ef38b59bf6', 'primary', target_user_id); -- Triceps

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '73a40beb-6668-489a-90d4-96a4297aa664', 'Face Pulls', 'Rear delt and upper back', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, 'ef8bd646-76e2-476f-bc6a-787a7868b783', 'primary', target_user_id), -- Upper Back / Traps
    (ex_id, '150dd0d9-49af-4c43-a8c5-c9121d22a4ae', 'secondary', target_user_id); -- Shoulders

  -- Lat Pulldown (3eb99053-def5-45fd-a508-34be956f76d6)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '3eb99053-def5-45fd-a508-34be956f76d6', 'Lat Pulldown', 'Back width exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, 'c70e5107-35be-49f6-b9fe-3ba1aa8d080b', 'primary', target_user_id), -- Lats
    (ex_id, 'a179c6df-4927-4f1c-837d-b877f3775c80', 'secondary', target_user_id); -- Biceps

  -- Pull-up Bar (1f34c0fc-99ea-4171-9902-4cc053a69c1d)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '1f34c0fc-99ea-4171-9902-4cc053a69c1d', 'Pull-ups', 'Bodyweight back exercise', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, 'c70e5107-35be-49f6-b9fe-3ba1aa8d080b', 'primary', target_user_id), -- Lats
    (ex_id, 'a179c6df-4927-4f1c-837d-b877f3775c80', 'secondary', target_user_id); -- Biceps

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '1f34c0fc-99ea-4171-9902-4cc053a69c1d', 'Chin-ups', 'Bicep focused pull-up', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, 'a179c6df-4927-4f1c-837d-b877f3775c80', 'primary', target_user_id), -- Biceps
    (ex_id, 'c70e5107-35be-49f6-b9fe-3ba1aa8d080b', 'secondary', target_user_id); -- Lats

  -- Smith Machine (10cba970-5662-49eb-aff8-e9cb6a5d8f49)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '10cba970-5662-49eb-aff8-e9cb6a5d8f49', 'Smith Machine Squat', 'Guided squat variation', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '82b8378c-cf35-49ca-9ea6-f10a46a7c31f', 'primary', target_user_id), -- Quads
    (ex_id, '0a77af88-b4fa-4697-94d6-00cd19ba8fe1', 'secondary', target_user_id); -- Glutes

  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '10cba970-5662-49eb-aff8-e9cb6a5d8f49', 'Smith Machine Calf Raise', 'Calf isolation', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '9e815539-d9b5-404e-a498-503d81cceca9', 'primary', target_user_id); -- Calves

  -- Squat Rack (4af4ad5f-7710-4e92-89e7-a5ca4ffbc808)
  INSERT INTO custom_exercises (id, equipment_id, name, description, user_id) VALUES
    (gen_random_uuid(), '4af4ad5f-7710-4e92-89e7-a5ca4ffbc808', 'Rack Pull', 'Partial deadlift from rack', target_user_id) RETURNING id INTO ex_id;
  INSERT INTO exercise_muscle_targets (exercise_id, muscle_group_id, target_type, user_id) VALUES
    (ex_id, '13431e9e-ea22-4000-a848-e15a6a82a936', 'primary', target_user_id), -- Back
    (ex_id, 'bbba1ef7-01f8-487e-8d0b-48c8b376e7db', 'secondary', target_user_id); -- Lower Back

END $$;