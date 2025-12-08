-- Fix Calf Raises muscle_group
UPDATE exercise_sets SET muscle_group = 'Calves' WHERE exercise_name = 'Calf Raises';

-- Insert exercise_set_muscles for today's workout sets that don't have them
-- Leg Press: Quads (primary), Glutes (secondary), Hamstrings (secondary)
INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Quads', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Leg Press' 
AND NOT EXISTS (SELECT 1 FROM exercise_set_muscles esm WHERE esm.exercise_set_id = es.id)
ON CONFLICT DO NOTHING;

INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Glutes', 'secondary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Leg Press' 
ON CONFLICT DO NOTHING;

INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Hamstrings', 'secondary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Leg Press' 
ON CONFLICT DO NOTHING;

-- Leg Curl: Hamstrings (primary), Glutes (secondary)
INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Hamstrings', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Leg Curl' 
AND NOT EXISTS (SELECT 1 FROM exercise_set_muscles esm WHERE esm.exercise_set_id = es.id)
ON CONFLICT DO NOTHING;

INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Glutes', 'secondary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Leg Curl' 
ON CONFLICT DO NOTHING;

-- Leg Extension: Quads (primary)
INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Quads', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Leg Extension' 
AND NOT EXISTS (SELECT 1 FROM exercise_set_muscles esm WHERE esm.exercise_set_id = es.id)
ON CONFLICT DO NOTHING;

-- Calf Raises: Calves (primary)
INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Calves', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Calf Raises' 
AND NOT EXISTS (SELECT 1 FROM exercise_set_muscles esm WHERE esm.exercise_set_id = es.id)
ON CONFLICT DO NOTHING;

-- Kneeling Cable Crunch: Abs (primary)
INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Abs', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Kneeling Cable Crunch' 
AND NOT EXISTS (SELECT 1 FROM exercise_set_muscles esm WHERE esm.exercise_set_id = es.id)
ON CONFLICT DO NOTHING;

-- Deadlift: Hamstrings (primary), Glutes (primary), Lower Back / Erectors (secondary), Lats (secondary)
INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Hamstrings', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Deadlift' 
AND NOT EXISTS (SELECT 1 FROM exercise_set_muscles esm WHERE esm.exercise_set_id = es.id AND esm.muscle_group = 'Hamstrings')
ON CONFLICT DO NOTHING;

INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Glutes', 'primary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Deadlift' 
ON CONFLICT DO NOTHING;

INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Lower Back / Erectors', 'secondary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Deadlift' 
ON CONFLICT DO NOTHING;

INSERT INTO exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT es.id, 'Lats', 'secondary', es.user_id
FROM exercise_sets es
WHERE es.exercise_name = 'Deadlift' 
ON CONFLICT DO NOTHING;