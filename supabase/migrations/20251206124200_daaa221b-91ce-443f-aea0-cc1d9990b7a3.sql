-- Add user_id column to equipment table
ALTER TABLE public.equipment ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow all access to equipment" ON public.equipment;

-- Create proper RLS policies for equipment
-- Default equipment (is_default = true) is readable by all authenticated users
-- User-added equipment is private to each user

CREATE POLICY "Authenticated users can view default equipment"
ON public.equipment
FOR SELECT
TO authenticated
USING (is_default = true);

CREATE POLICY "Users can view their own equipment"
ON public.equipment
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own equipment"
ON public.equipment
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND is_default = false);

CREATE POLICY "Users can update their own equipment"
ON public.equipment
FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND is_default = false);

CREATE POLICY "Users can delete their own equipment"
ON public.equipment
FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND is_default = false);