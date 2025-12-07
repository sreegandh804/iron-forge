-- Fix historical exercise_sets: change generic "Back" to "Lats"
UPDATE exercise_sets 
SET muscle_group = 'Lats' 
WHERE muscle_group = 'Back';

-- Delete duplicate exercise_muscle_targets that would conflict
-- (where exercise already has a "Lats" target and also has "Back" target)
DELETE FROM exercise_muscle_targets 
WHERE muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Back' LIMIT 1)
  AND exercise_id IN (
    SELECT exercise_id FROM exercise_muscle_targets 
    WHERE muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Lats' LIMIT 1)
  );

-- Now update remaining exercise_muscle_targets pointing to "Back" to point to "Lats"
UPDATE exercise_muscle_targets 
SET muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Lats' LIMIT 1)
WHERE muscle_group_id = (SELECT id FROM muscle_groups WHERE name = 'Back' LIMIT 1);

-- Delete the generic "Back" muscle group since we now use specific Lats/Traps/Lower Back
DELETE FROM muscle_groups WHERE name = 'Back';