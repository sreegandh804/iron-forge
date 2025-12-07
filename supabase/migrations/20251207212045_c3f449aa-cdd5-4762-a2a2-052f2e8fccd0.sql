-- Fix exercise_sets muscle groups
UPDATE exercise_sets SET muscle_group = 'Lats' WHERE muscle_group = 'Back';
UPDATE exercise_sets SET muscle_group = 'Upper Back / Traps' WHERE exercise_name = 'Face Pulls';
UPDATE exercise_sets SET muscle_group = 'Shoulders (Delts)' WHERE muscle_group = 'Shoulders';

-- Fix workout_template_exercises muscle groups
UPDATE workout_template_exercises SET muscle_group = 'Lats' WHERE muscle_group = 'Back';
UPDATE workout_template_exercises SET muscle_group = 'Shoulders (Delts)' WHERE muscle_group = 'Shoulders';

-- Delete exercise_muscle_targets that would create duplicates when updating Shoulders to Shoulders (Delts)
DELETE FROM exercise_muscle_targets 
WHERE muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Shoulders' LIMIT 1)
  AND exercise_id IN (
    SELECT exercise_id FROM exercise_muscle_targets 
    WHERE muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Shoulders (Delts)' LIMIT 1)
  );

-- Update remaining Shoulders targets to Shoulders (Delts)
UPDATE exercise_muscle_targets 
SET muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Shoulders (Delts)' LIMIT 1)
WHERE muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Shoulders' LIMIT 1);

-- Delete duplicate "Shoulders" muscle group
DELETE FROM muscle_groups WHERE name = 'Shoulders';