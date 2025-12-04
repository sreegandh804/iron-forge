// Map database muscle group names to react-body-highlighter muscle slugs
export const muscleToSlug: Record<string, string[]> = {
  'Chest': ['chest'],
  'Biceps': ['biceps'],
  'Triceps': ['triceps'],
  'Shoulders (Delts)': ['front-deltoids', 'back-deltoids'],
  'Quads': ['quadriceps'],
  'Hamstrings': ['hamstring'],
  'Back': ['upper-back', 'trapezius'],
  'Lats': ['upper-back'],
  'Glutes': ['gluteal'],
  'Calves': ['calves'],
  'Abs': ['abs'],
  'Obliques': ['obliques'],
  'Forearms': ['forearm'],
  'Upper Back / Traps': ['trapezius', 'upper-back'],
  'Lower Back / Erectors': ['lower-back'],
};

// Reverse mapping from slug to display name
export const slugToMuscle: Record<string, string> = {
  'chest': 'Chest',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'front-deltoids': 'Shoulders (Delts)',
  'back-deltoids': 'Shoulders (Delts)',
  'quadriceps': 'Quads',
  'hamstring': 'Hamstrings',
  'upper-back': 'Back',
  'trapezius': 'Upper Back / Traps',
  'gluteal': 'Glutes',
  'calves': 'Calves',
  'abs': 'Abs',
  'obliques': 'Obliques',
  'forearm': 'Forearms',
  'lower-back': 'Lower Back / Erectors',
};

// Convert muscle group name to slugs for the library
export function getMuscleSlug(muscleName: string): string[] {
  return muscleToSlug[muscleName] || [];
}

// Convert array of muscle names to unique slugs
export function musclesToSlugs(muscleNames: string[]): string[] {
  const slugs = new Set<string>();
  muscleNames.forEach(name => {
    const mapping = muscleToSlug[name];
    if (mapping) {
      mapping.forEach(slug => slugs.add(slug));
    }
  });
  return Array.from(slugs);
}
