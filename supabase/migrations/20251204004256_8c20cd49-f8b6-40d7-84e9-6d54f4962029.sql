-- Create equipment table (migrate from localStorage)
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('machine', 'free-weight', 'cardio', 'cable', 'bodyweight')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create muscle_groups table with predefined data
CREATE TABLE public.muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  body_region TEXT NOT NULL CHECK (body_region IN ('upper-body', 'lower-body', 'core'))
);

-- Seed muscle groups
INSERT INTO public.muscle_groups (name, body_region) VALUES
  ('Chest', 'upper-body'),
  ('Back', 'upper-body'),
  ('Shoulders', 'upper-body'),
  ('Biceps', 'upper-body'),
  ('Triceps', 'upper-body'),
  ('Forearms', 'upper-body'),
  ('Quads', 'lower-body'),
  ('Hamstrings', 'lower-body'),
  ('Glutes', 'lower-body'),
  ('Calves', 'lower-body'),
  ('Abs', 'core'),
  ('Obliques', 'core');

-- Create custom_exercises table
CREATE TABLE public.custom_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create exercise_muscle_targets junction table
CREATE TABLE public.exercise_muscle_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES public.custom_exercises(id) ON DELETE CASCADE NOT NULL,
  muscle_group_id UUID REFERENCES public.muscle_groups(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('primary', 'secondary')),
  UNIQUE (exercise_id, muscle_group_id)
);

-- Enable RLS on all tables
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_muscle_targets ENABLE ROW LEVEL SECURITY;

-- RLS policies for equipment
CREATE POLICY "Allow all access to equipment"
ON public.equipment FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for muscle_groups (read-only for all)
CREATE POLICY "Allow read access to muscle_groups"
ON public.muscle_groups FOR SELECT
USING (true);

-- RLS policies for custom_exercises
CREATE POLICY "Allow all access to custom_exercises"
ON public.custom_exercises FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for exercise_muscle_targets
CREATE POLICY "Allow all access to exercise_muscle_targets"
ON public.exercise_muscle_targets FOR ALL
USING (true)
WITH CHECK (true);