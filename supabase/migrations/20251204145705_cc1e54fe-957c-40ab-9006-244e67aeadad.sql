-- Add recovery_hours column to muscle_groups table
ALTER TABLE muscle_groups ADD COLUMN recovery_hours INTEGER DEFAULT 48;

-- Set specific recovery times by muscle type
UPDATE muscle_groups SET recovery_hours = 72 WHERE name IN ('Back', 'Lats', 'Chest', 'Quads', 'Hamstrings', 'Glutes');
UPDATE muscle_groups SET recovery_hours = 48 WHERE name IN ('Shoulders', 'Shoulders (Delts)', 'Biceps', 'Triceps', 'Upper Back / Traps');
UPDATE muscle_groups SET recovery_hours = 24 WHERE name IN ('Abs', 'Obliques', 'Calves', 'Forearms', 'Lower Back / Erectors');