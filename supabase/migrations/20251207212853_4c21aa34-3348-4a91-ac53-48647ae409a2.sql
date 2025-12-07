-- Create exercise_set_muscles junction table to track all muscles worked per set
CREATE TABLE public.exercise_set_muscles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_set_id UUID NOT NULL REFERENCES exercise_sets(id) ON DELETE CASCADE,
  muscle_group TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('primary', 'secondary')),
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercise_set_muscles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own exercise set muscles"
ON public.exercise_set_muscles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise set muscles"
ON public.exercise_set_muscles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise set muscles"
ON public.exercise_set_muscles FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_exercise_set_muscles_set_id ON public.exercise_set_muscles(exercise_set_id);
CREATE INDEX idx_exercise_set_muscles_user_id ON public.exercise_set_muscles(user_id);

-- Migrate existing exercise_sets data to the new junction table
-- Each existing set gets its muscle_group added as a primary target
INSERT INTO public.exercise_set_muscles (exercise_set_id, muscle_group, target_type, user_id)
SELECT id, muscle_group, 'primary', user_id FROM exercise_sets;