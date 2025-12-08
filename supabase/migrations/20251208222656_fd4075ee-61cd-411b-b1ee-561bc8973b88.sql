-- Step 1: Add muscle_targets JSONB column to workout_template_exercises
ALTER TABLE workout_template_exercises 
ADD COLUMN IF NOT EXISTS muscle_targets JSONB DEFAULT '[]'::jsonb;

-- Step 2: Add status column to workout_logs for save/continue feature
ALTER TABLE workout_logs
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed'));

-- Step 3: Update workout_template_exercises with proper muscle targets
-- Leg Press: Quads (primary), Glutes (secondary), Hamstrings (secondary)
UPDATE workout_template_exercises 
SET muscle_group = 'Quads',
    muscle_targets = '[{"name": "Quads", "type": "primary"}, {"name": "Glutes", "type": "secondary"}, {"name": "Hamstrings", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Leg Press';

-- Leg Curl: Hamstrings (primary), Glutes (secondary)
UPDATE workout_template_exercises 
SET muscle_group = 'Hamstrings',
    muscle_targets = '[{"name": "Hamstrings", "type": "primary"}, {"name": "Glutes", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Leg Curl';

-- Leg Extension: Quads (primary)
UPDATE workout_template_exercises 
SET muscle_group = 'Quads',
    muscle_targets = '[{"name": "Quads", "type": "primary"}]'::jsonb
WHERE exercise_name = 'Leg Extension';

-- Calf Raises: Calves (primary)
UPDATE workout_template_exercises 
SET muscle_group = 'Calves',
    muscle_targets = '[{"name": "Calves", "type": "primary"}]'::jsonb
WHERE exercise_name = 'Calf Raises';

-- Barbell Squat: Quads (primary), Glutes (secondary), Hamstrings (secondary)
UPDATE workout_template_exercises 
SET muscle_group = 'Quads',
    muscle_targets = '[{"name": "Quads", "type": "primary"}, {"name": "Glutes", "type": "secondary"}, {"name": "Hamstrings", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Barbell Squat';

-- Romanian Deadlift: Hamstrings (primary), Glutes (primary), Lower Back / Erectors (secondary)
UPDATE workout_template_exercises 
SET muscle_group = 'Hamstrings',
    muscle_targets = '[{"name": "Hamstrings", "type": "primary"}, {"name": "Glutes", "type": "primary"}, {"name": "Lower Back / Erectors", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Romanian Deadlift';

-- Deadlift: Hamstrings (primary), Glutes (primary), Lower Back / Erectors (secondary), Lats (secondary)
UPDATE workout_template_exercises 
SET muscle_group = 'Hamstrings',
    muscle_targets = '[{"name": "Hamstrings", "type": "primary"}, {"name": "Glutes", "type": "primary"}, {"name": "Lower Back / Erectors", "type": "secondary"}, {"name": "Lats", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Deadlift';

-- Walking Lunges: Quads (primary), Glutes (secondary), Hamstrings (secondary)
UPDATE workout_template_exercises 
SET muscle_group = 'Quads',
    muscle_targets = '[{"name": "Quads", "type": "primary"}, {"name": "Glutes", "type": "secondary"}, {"name": "Hamstrings", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Walking Lunges';

-- Bench Press: Chest (primary), Triceps (secondary), Shoulders (secondary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Chest", "type": "primary"}, {"name": "Triceps", "type": "secondary"}, {"name": "Shoulders (Delts)", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Bench Press';

-- Incline Dumbbell Press: Chest (primary), Triceps (secondary), Shoulders (secondary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Chest", "type": "primary"}, {"name": "Triceps", "type": "secondary"}, {"name": "Shoulders (Delts)", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Incline Dumbbell Press';

-- Overhead Press / Dumbbell Shoulder Press: Shoulders (primary), Triceps (secondary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Shoulders (Delts)", "type": "primary"}, {"name": "Triceps", "type": "secondary"}]'::jsonb
WHERE exercise_name IN ('Overhead Press', 'Dumbbell Shoulder Press');

-- Barbell Row: Lats (primary), Upper Back / Traps (secondary), Biceps (secondary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Lats", "type": "primary"}, {"name": "Upper Back / Traps", "type": "secondary"}, {"name": "Biceps", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Barbell Row';

-- Lat Pulldown: Lats (primary), Biceps (secondary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Lats", "type": "primary"}, {"name": "Biceps", "type": "secondary"}]'::jsonb
WHERE exercise_name = 'Lat Pulldown';

-- Cable Flyes: Chest (primary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Chest", "type": "primary"}]'::jsonb
WHERE exercise_name = 'Cable Flyes';

-- Lateral Raises: Shoulders (primary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Shoulders (Delts)", "type": "primary"}]'::jsonb
WHERE exercise_name = 'Lateral Raises';

-- Tricep Pushdown / Overhead Tricep Extension / Skull Crushers: Triceps (primary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Triceps", "type": "primary"}]'::jsonb
WHERE exercise_name IN ('Tricep Pushdown', 'Overhead Tricep Extension', 'Skull Crushers');

-- Barbell Curl / Hammer Curl: Biceps (primary)
UPDATE workout_template_exercises 
SET muscle_targets = '[{"name": "Biceps", "type": "primary"}]'::jsonb
WHERE exercise_name IN ('Barbell Curl', 'Hammer Curl');

-- Step 4: Fix historical exercise_sets with 'Legs' muscle_group
-- Update Leg Press sets to Quads
UPDATE exercise_sets SET muscle_group = 'Quads' WHERE exercise_name = 'Leg Press' AND muscle_group = 'Legs';

-- Update Leg Curl sets to Hamstrings
UPDATE exercise_sets SET muscle_group = 'Hamstrings' WHERE exercise_name = 'Leg Curl' AND muscle_group = 'Legs';

-- Update Leg Extension sets to Quads
UPDATE exercise_sets SET muscle_group = 'Quads' WHERE exercise_name = 'Leg Extension' AND muscle_group = 'Legs';

-- Update Barbell Squat sets to Quads
UPDATE exercise_sets SET muscle_group = 'Quads' WHERE exercise_name = 'Barbell Squat' AND muscle_group = 'Legs';

-- Update Romanian Deadlift sets to Hamstrings
UPDATE exercise_sets SET muscle_group = 'Hamstrings' WHERE exercise_name = 'Romanian Deadlift' AND muscle_group = 'Legs';

-- Update Walking Lunges sets to Quads
UPDATE exercise_sets SET muscle_group = 'Quads' WHERE exercise_name = 'Walking Lunges' AND muscle_group = 'Legs';

-- Update any remaining 'Legs' to 'Quads' as fallback
UPDATE exercise_sets SET muscle_group = 'Quads' WHERE muscle_group = 'Legs';

-- Step 5: Add Cable Woodchopper exercise to custom_exercises (will be done via code after user approves)
-- For now, just ensure the muscle_groups table has Obliques if needed