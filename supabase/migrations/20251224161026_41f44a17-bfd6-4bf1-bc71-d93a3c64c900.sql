-- Clean up stale muscle entries for exercises where muscle targets have been updated
-- This specifically removes Glutes entries that were saved with Lower Back Machine but later removed

DELETE FROM exercise_set_muscles 
WHERE id IN (
  SELECT esm.id 
  FROM exercise_set_muscles esm
  JOIN exercise_sets es ON esm.exercise_set_id = es.id
  WHERE es.exercise_name = 'Lower Back Machine' 
  AND esm.muscle_group = 'Glutes'
);