-- Fix custom_programs table - add user_id and proper RLS
ALTER TABLE public.custom_programs ADD COLUMN user_id UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Allow all access to custom_programs" ON public.custom_programs;

CREATE POLICY "Users can read own programs"
ON public.custom_programs FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own programs"
ON public.custom_programs FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own programs"
ON public.custom_programs FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own programs"
ON public.custom_programs FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Fix custom_program_workouts table - add user_id and proper RLS
ALTER TABLE public.custom_program_workouts ADD COLUMN user_id UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Allow all access to custom_program_workouts" ON public.custom_program_workouts;

CREATE POLICY "Users can read own program workouts"
ON public.custom_program_workouts FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own program workouts"
ON public.custom_program_workouts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own program workouts"
ON public.custom_program_workouts FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own program workouts"
ON public.custom_program_workouts FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Fix custom_exercises table - add user_id and proper RLS
ALTER TABLE public.custom_exercises ADD COLUMN user_id UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Allow all access to custom_exercises" ON public.custom_exercises;

CREATE POLICY "Authenticated users can read all exercises"
ON public.custom_exercises FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own exercises"
ON public.custom_exercises FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own exercises"
ON public.custom_exercises FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own exercises"
ON public.custom_exercises FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Fix exercise_muscle_targets table - add user_id and proper RLS
ALTER TABLE public.exercise_muscle_targets ADD COLUMN user_id UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "Allow all access to exercise_muscle_targets" ON public.exercise_muscle_targets;

CREATE POLICY "Authenticated users can read all muscle targets"
ON public.exercise_muscle_targets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own muscle targets"
ON public.exercise_muscle_targets FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own muscle targets"
ON public.exercise_muscle_targets FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own muscle targets"
ON public.exercise_muscle_targets FOR DELETE TO authenticated
USING (user_id = auth.uid());