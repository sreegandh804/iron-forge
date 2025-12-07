-- Fix Shoulder Press exercise_sets records that were incorrectly tagged as Triceps
UPDATE exercise_sets 
SET muscle_group = 'Shoulders (Delts)' 
WHERE exercise_name = 'Shoulder Press' AND muscle_group = 'Triceps';