// Anatomically accurate muscle polygon data based on react-body-highlighter
// Each muscle has one or more polygon shapes for accurate representation

export interface MusclePathData {
  slug: string;
  name: string;
  polygons: string[];
}

export const frontMuscleData: MusclePathData[] = [
  {
    slug: 'chest',
    name: 'Chest',
    polygons: [
      '51.8,41.6 51.0,55.1 58.0,58.0 67.8,55.5 70.6,47.3 62.0,41.6',
      '29.8,46.5 31.4,55.5 40.8,58.0 48.2,55.1 47.8,42.0 37.6,42.0'
    ]
  },
  {
    slug: 'abs',
    name: 'Abs',
    polygons: [
      '43.3,58.8 43.3,65.3 45.7,65.3 45.7,58.8',
      '53.5,58.8 53.5,65.3 55.9,65.3 55.9,58.8',
      '43.3,66.5 43.3,73.1 45.7,73.1 45.7,66.5',
      '53.5,66.5 53.5,73.1 55.9,73.1 55.9,66.5',
      '43.3,74.3 43.3,80.8 45.7,80.8 45.7,74.3',
      '53.5,74.3 53.5,80.8 55.9,80.8 55.9,74.3',
      '46.9,58.8 46.9,65.3 52.2,65.3 52.2,58.8',
      '46.9,66.5 46.9,73.1 52.2,73.1 52.2,66.5',
      '46.9,74.3 46.9,80.8 52.2,80.8 52.2,74.3'
    ]
  },
  {
    slug: 'obliques',
    name: 'Obliques',
    polygons: [
      '56.7,58.8 58.0,58.0 62.9,61.2 60.4,82.0 56.7,82.0',
      '42.0,58.8 40.8,58.0 35.9,61.2 38.4,82.0 42.0,82.0'
    ]
  },
  {
    slug: 'front-deltoids',
    name: 'Shoulders',
    polygons: [
      '67.8,55.5 70.6,47.3 75.5,45.7 79.2,49.0 76.3,57.6 71.0,61.2',
      '29.8,46.5 24.9,45.7 20.4,49.0 23.3,57.6 28.2,61.2 31.4,55.5'
    ]
  },
  {
    slug: 'biceps',
    name: 'Biceps',
    polygons: [
      '76.3,57.6 79.2,49.0 83.3,53.1 82.9,65.7 77.6,71.0 74.3,63.3',
      '23.3,57.6 20.4,49.0 16.3,53.1 16.7,65.7 22.0,71.0 25.3,63.3'
    ]
  },
  {
    slug: 'forearm',
    name: 'Forearms',
    polygons: [
      '77.6,71.0 82.9,65.7 87.3,71.8 88.2,82.9 83.7,91.0 79.2,85.3',
      '22.0,71.0 16.7,65.7 12.2,71.8 11.4,82.9 15.9,91.0 20.4,85.3'
    ]
  },
  {
    slug: 'quadriceps',
    name: 'Quads',
    polygons: [
      '56.7,82.0 60.4,82.0 64.9,98.8 66.9,120.4 61.6,132.2 55.5,131.8 53.5,110.6',
      '42.0,82.0 38.4,82.0 33.9,98.8 31.8,120.4 37.1,132.2 43.3,131.8 45.3,110.6'
    ]
  },
  {
    slug: 'adductors',
    name: 'Adductors',
    polygons: [
      '45.3,95.5 49.4,82.9 53.5,95.5 53.5,110.6 49.4,118.8 45.3,110.6'
    ]
  },
  {
    slug: 'tibialis',
    name: 'Tibialis',
    polygons: [
      '55.5,131.8 61.6,132.2 63.7,155.9 60.0,173.5 55.1,173.5 55.5,155.1',
      '43.3,131.8 37.1,132.2 35.1,155.9 38.8,173.5 43.7,173.5 43.3,155.1'
    ]
  },
  {
    slug: 'head',
    name: 'Head',
    polygons: [
      '42.0,14.3 42.0,26.5 49.4,32.7 57.6,26.5 57.6,14.3 49.4,8.2'
    ]
  },
  {
    slug: 'neck',
    name: 'Neck',
    polygons: [
      '44.5,32.7 44.5,41.6 49.4,44.1 54.3,41.6 54.3,32.7 49.4,35.1'
    ]
  }
];

export const backMuscleData: MusclePathData[] = [
  {
    slug: 'trapezius',
    name: 'Traps',
    polygons: [
      '37.6,42.0 49.4,55.1 61.2,42.0 57.6,38.0 49.4,44.1 41.2,38.0'
    ]
  },
  {
    slug: 'upper-back',
    name: 'Upper Back',
    polygons: [
      '37.6,42.0 33.5,49.0 36.7,61.2 44.1,61.2 49.4,55.1',
      '61.2,42.0 65.3,49.0 62.0,61.2 54.7,61.2 49.4,55.1'
    ]
  },
  {
    slug: 'back-deltoids',
    name: 'Rear Delts',
    polygons: [
      '29.4,46.9 33.5,49.0 31.8,58.8 25.7,61.2 22.4,53.1',
      '69.4,46.9 65.3,49.0 67.0,58.8 73.1,61.2 76.3,53.1'
    ]
  },
  {
    slug: 'triceps',
    name: 'Triceps',
    polygons: [
      '22.4,53.1 25.7,61.2 23.3,71.0 16.7,68.6 17.6,57.6',
      '76.3,53.1 73.1,61.2 75.5,71.0 82.0,68.6 81.2,57.6'
    ]
  },
  {
    slug: 'lats',
    name: 'Lats',
    polygons: [
      '36.7,61.2 33.5,71.8 40.4,82.0 46.1,77.1 44.1,61.2',
      '62.0,61.2 65.3,71.8 58.4,82.0 52.7,77.1 54.7,61.2'
    ]
  },
  {
    slug: 'lower-back',
    name: 'Lower Back',
    polygons: [
      '44.1,69.4 44.1,82.0 49.4,85.3 54.7,82.0 54.7,69.4 49.4,72.7'
    ]
  },
  {
    slug: 'gluteal',
    name: 'Glutes',
    polygons: [
      '40.4,82.0 38.0,98.0 49.4,101.6 46.1,85.3',
      '58.4,82.0 60.8,98.0 49.4,101.6 52.7,85.3'
    ]
  },
  {
    slug: 'hamstring',
    name: 'Hamstrings',
    polygons: [
      '38.0,98.0 35.1,120.8 37.6,136.7 44.9,136.7 47.3,115.5 49.4,101.6',
      '60.8,98.0 63.7,120.8 61.2,136.7 53.9,136.7 51.4,115.5 49.4,101.6'
    ]
  },
  {
    slug: 'calves',
    name: 'Calves',
    polygons: [
      '37.6,136.7 35.9,155.9 38.4,173.5 44.5,173.5 44.9,155.1 44.9,136.7',
      '61.2,136.7 62.9,155.9 60.4,173.5 54.3,173.5 53.9,155.1 53.9,136.7'
    ]
  },
  {
    slug: 'rear-forearm',
    name: 'Forearms',
    polygons: [
      '16.7,68.6 23.3,71.0 20.8,85.3 15.1,91.0 11.8,82.0',
      '82.0,68.6 75.5,71.0 78.0,85.3 83.7,91.0 87.0,82.0'
    ]
  },
  {
    slug: 'head-back',
    name: 'Head',
    polygons: [
      '42.0,14.3 42.0,26.5 49.4,32.7 57.6,26.5 57.6,14.3 49.4,8.2'
    ]
  },
  {
    slug: 'neck-back',
    name: 'Neck',
    polygons: [
      '44.5,32.7 44.5,38.0 49.4,41.2 54.3,38.0 54.3,32.7 49.4,35.1'
    ]
  }
];

// Mapping from SVG slug to database muscle group name
export const muscleSlugToDbName: Record<string, string> = {
  'chest': 'Chest',
  'abs': 'Abs',
  'obliques': 'Obliques',
  'front-deltoids': 'Shoulders (Delts)',
  'back-deltoids': 'Shoulders (Delts)',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearm': 'Forearms',
  'rear-forearm': 'Forearms',
  'quadriceps': 'Quads',
  'adductors': 'Adductors',
  'tibialis': 'Tibialis',
  'trapezius': 'Upper Back / Traps',
  'upper-back': 'Back',
  'lats': 'Lats',
  'lower-back': 'Lower Back / Erectors',
  'gluteal': 'Glutes',
  'hamstring': 'Hamstrings',
  'calves': 'Calves',
  'head': 'Head',
  'head-back': 'Head',
  'neck': 'Neck',
  'neck-back': 'Neck'
};
