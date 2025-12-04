import { backMuscleData, muscleSlugToDbName } from './musclePathData';
import { MuscleRecoveryStatus } from '@/hooks/useMuscleRecoveryStatus';
import { useMuscleHighlight } from '@/context/MuscleHighlightContext';

interface BodyBackProps {
  recoveryData: MuscleRecoveryStatus[];
  onMuscleHover: (muscleName: string | null, event?: React.MouseEvent) => void;
  onMuscleClick: (muscleName: string) => void;
}

export const BodyBack = ({ recoveryData, onMuscleHover, onMuscleClick }: BodyBackProps) => {
  const { highlightedMuscles, highlightMode } = useMuscleHighlight();

  const getMuscleClass = (slug: string): string => {
    const dbName = muscleSlugToDbName[slug];
    if (!dbName) return 'muscle-polygon muscle-neutral';

    // Check if muscle is highlighted
    const highlighted = highlightedMuscles.find(m => m.name === dbName);
    if (highlightMode !== 'recovery' && highlighted) {
      return highlighted.isPrimary 
        ? 'muscle-polygon muscle-highlighted-primary' 
        : 'muscle-polygon muscle-highlighted-secondary';
    }

    // Default to recovery mode
    const recovery = recoveryData.find(r => r.name === dbName);
    if (!recovery) return 'muscle-polygon muscle-neutral';

    switch (recovery.status) {
      case 'fatigued':
        return 'muscle-polygon muscle-fatigued';
      case 'recovering':
        return 'muscle-polygon muscle-recovering';
      case 'ready':
        return 'muscle-polygon muscle-ready';
      default:
        return 'muscle-polygon muscle-neutral';
    }
  };

  const handleMouseEnter = (slug: string, event: React.MouseEvent) => {
    const dbName = muscleSlugToDbName[slug];
    if (dbName) {
      onMuscleHover(dbName, event);
    }
  };

  return (
    <svg 
      viewBox="0 0 100 200" 
      className="w-full h-full"
      style={{ maxHeight: '280px' }}
    >
      {/* Body outline */}
      <ellipse cx="49.4" cy="20" rx="10" ry="14" className="fill-muted/30 stroke-border stroke-[0.5]" />
      
      {/* Render all back muscles */}
      {backMuscleData.map((muscle) => (
        muscle.polygons.map((points, idx) => (
          <polygon
            key={`${muscle.slug}-${idx}`}
            data-muscle={muscle.slug}
            points={points}
            className={getMuscleClass(muscle.slug)}
            onMouseEnter={(e) => handleMouseEnter(muscle.slug, e)}
            onMouseLeave={() => onMuscleHover(null)}
            onClick={() => {
              const dbName = muscleSlugToDbName[muscle.slug];
              if (dbName) onMuscleClick(dbName);
            }}
            style={{ cursor: 'pointer' }}
          />
        ))
      ))}
    </svg>
  );
};
