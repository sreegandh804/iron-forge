-- Add Adductors muscle group
INSERT INTO muscle_groups (name, body_region, recovery_hours)
VALUES ('Adductors', 'lower-body', 48)
ON CONFLICT DO NOTHING;

-- Add Adductor Machine equipment (as default/system equipment)
INSERT INTO equipment (name, category, is_default, is_available)
VALUES ('Adductor Machine', 'machine', true, true)
ON CONFLICT DO NOTHING;