-- Create RPC function to get the most recent workout date for each muscle group
CREATE OR REPLACE FUNCTION get_muscle_last_worked()
RETURNS TABLE (
  muscle_group TEXT,
  last_worked TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    esm.muscle_group,
    MAX(wl.completed_at) as last_worked
  FROM exercise_set_muscles esm
  JOIN exercise_sets es ON esm.exercise_set_id = es.id
  JOIN workout_logs wl ON es.workout_log_id = wl.id
  WHERE esm.user_id = auth.uid()
  GROUP BY esm.muscle_group;
$$;