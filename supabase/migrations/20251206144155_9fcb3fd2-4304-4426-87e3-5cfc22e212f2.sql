-- Create workout_templates table for default workout structures
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL,
  day_label TEXT,
  sort_order INTEGER DEFAULT 0,
  is_system BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Everyone can read system templates
CREATE POLICY "Anyone can read system templates"
ON public.workout_templates
FOR SELECT
USING (is_system = true);

-- Create workout_template_exercises linking exercises to templates
CREATE TABLE public.workout_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workout_template_exercises ENABLE ROW LEVEL SECURITY;

-- Everyone can read template exercises
CREATE POLICY "Anyone can read template exercises"
ON public.workout_template_exercises
FOR SELECT
USING (true);

-- Create user_workout_templates for user customizations
CREATE TABLE public.user_workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  base_template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  program_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  day_label TEXT,
  exercises JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_workout_templates ENABLE ROW LEVEL SECURITY;

-- Users can only access their own customizations
CREATE POLICY "Users can read own templates"
ON public.user_workout_templates
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own templates"
ON public.user_workout_templates
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own templates"
ON public.user_workout_templates
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own templates"
ON public.user_workout_templates
FOR DELETE
USING (user_id = auth.uid());

-- Insert system workout templates
INSERT INTO public.workout_templates (title, description, program_type, day_label, sort_order) VALUES
-- Full Body
('Full Body A', 'Complete full body workout focusing on compound movements', 'full-body', 'Day 1', 1),
('Full Body B', 'Variation of full body workout with different exercise selection', 'full-body', 'Day 2', 2),
-- PPL
('Push Day', 'Chest, shoulders, and triceps focused workout', 'ppl', 'Push', 1),
('Pull Day', 'Back and biceps focused workout', 'ppl', 'Pull', 2),
('Legs Day', 'Complete lower body workout', 'ppl', 'Legs', 3),
-- Upper/Lower
('Upper Body', 'Complete upper body workout', 'upper-lower', 'Upper', 1),
('Lower Body', 'Complete lower body workout', 'upper-lower', 'Lower', 2);

-- Insert template exercises for Full Body A
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Barbell Squat', 'Legs', 'Barbell', 1),
  ('Bench Press', 'Chest', 'Barbell', 2),
  ('Barbell Row', 'Back', 'Barbell', 3),
  ('Overhead Press', 'Shoulders', 'Barbell', 4),
  ('Romanian Deadlift', 'Legs', 'Barbell', 5),
  ('Barbell Curl', 'Biceps', 'Barbell', 6),
  ('Tricep Pushdown', 'Triceps', 'Cable Machine', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Full Body A';

-- Insert template exercises for Full Body B
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Deadlift', 'Back', 'Barbell', 1),
  ('Incline Dumbbell Press', 'Chest', 'Dumbbells', 2),
  ('Lat Pulldown', 'Back', 'Cable Machine', 3),
  ('Dumbbell Shoulder Press', 'Shoulders', 'Dumbbells', 4),
  ('Leg Press', 'Legs', 'Leg Press Machine', 5),
  ('Hammer Curl', 'Biceps', 'Dumbbells', 6),
  ('Skull Crushers', 'Triceps', 'EZ Bar', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Full Body B';

-- Insert template exercises for Push Day
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Bench Press', 'Chest', 'Barbell', 1),
  ('Incline Dumbbell Press', 'Chest', 'Dumbbells', 2),
  ('Overhead Press', 'Shoulders', 'Barbell', 3),
  ('Lateral Raises', 'Shoulders', 'Dumbbells', 4),
  ('Cable Flyes', 'Chest', 'Cable Machine', 5),
  ('Tricep Pushdown', 'Triceps', 'Cable Machine', 6),
  ('Overhead Tricep Extension', 'Triceps', 'Dumbbells', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Push Day';

-- Insert template exercises for Pull Day
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Deadlift', 'Back', 'Barbell', 1),
  ('Barbell Row', 'Back', 'Barbell', 2),
  ('Lat Pulldown', 'Back', 'Cable Machine', 3),
  ('Seated Cable Row', 'Back', 'Cable Machine', 4),
  ('Face Pulls', 'Shoulders', 'Cable Machine', 5),
  ('Barbell Curl', 'Biceps', 'Barbell', 6),
  ('Hammer Curl', 'Biceps', 'Dumbbells', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Pull Day';

-- Insert template exercises for Legs Day
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Barbell Squat', 'Legs', 'Barbell', 1),
  ('Romanian Deadlift', 'Legs', 'Barbell', 2),
  ('Leg Press', 'Legs', 'Leg Press Machine', 3),
  ('Leg Curl', 'Legs', 'Leg Curl Machine', 4),
  ('Leg Extension', 'Legs', 'Leg Extension Machine', 5),
  ('Calf Raises', 'Legs', 'Calf Raise Machine', 6),
  ('Walking Lunges', 'Legs', 'Dumbbells', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Legs Day';

-- Insert template exercises for Upper Body
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Bench Press', 'Chest', 'Barbell', 1),
  ('Barbell Row', 'Back', 'Barbell', 2),
  ('Overhead Press', 'Shoulders', 'Barbell', 3),
  ('Lat Pulldown', 'Back', 'Cable Machine', 4),
  ('Incline Dumbbell Press', 'Chest', 'Dumbbells', 5),
  ('Barbell Curl', 'Biceps', 'Barbell', 6),
  ('Tricep Pushdown', 'Triceps', 'Cable Machine', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Upper Body';

-- Insert template exercises for Lower Body
INSERT INTO public.workout_template_exercises (template_id, exercise_name, muscle_group, equipment_name, sort_order)
SELECT t.id, e.exercise_name, e.muscle_group, e.equipment_name, e.sort_order
FROM public.workout_templates t
CROSS JOIN (VALUES
  ('Barbell Squat', 'Legs', 'Barbell', 1),
  ('Romanian Deadlift', 'Legs', 'Barbell', 2),
  ('Leg Press', 'Legs', 'Leg Press Machine', 3),
  ('Leg Curl', 'Legs', 'Leg Curl Machine', 4),
  ('Leg Extension', 'Legs', 'Leg Extension Machine', 5),
  ('Calf Raises', 'Legs', 'Calf Raise Machine', 6),
  ('Hip Thrust', 'Legs', 'Barbell', 7)
) AS e(exercise_name, muscle_group, equipment_name, sort_order)
WHERE t.title = 'Lower Body';