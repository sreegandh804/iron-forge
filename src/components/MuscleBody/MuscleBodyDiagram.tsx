import { useState } from 'react';
import Model from 'react-body-highlighter';
import { NeuCard } from '@/components/ui/neu-card';
import { useMuscleRecoveryStatus, MuscleRecoveryStatus } from '@/hooks/useMuscleRecoveryStatus';
import { Activity } from 'lucide-react';
import { musclesToSlugs } from './muscleMapping';
import { MuscleTooltip } from './MuscleTooltip';

export const MuscleBodyDiagram = () => {
  const [viewSide, setViewSide] = useState<'anterior' | 'posterior'>('anterior');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleRecoveryStatus | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { data: recoveryData = [], isLoading } = useMuscleRecoveryStatus();

  // Build exercise data for the model based on recovery status
  // Only include fatigued/recovering muscles - ready muscles show as neutral bodyColor
  const buildMuscleData = () => {
    const result: any[] = [];
    
    recoveryData.forEach(muscle => {
      if (muscle.status === 'fatigued') {
        result.push({
          name: muscle.name,
          muscles: musclesToSlugs([muscle.name]) as any[],
          frequency: 2, // Higher frequency = red (fatigued)
        });
      } else if (muscle.status === 'recovering') {
        result.push({
          name: muscle.name,
          muscles: musclesToSlugs([muscle.name]) as any[],
          frequency: 1, // Lower frequency = amber (recovering)
        });
      }
      // 'ready' muscles are NOT added - they show neutral bodyColor
    });
    
    return result;
  };

  // Count muscles by status
  const statusCounts = recoveryData.reduce(
    (acc, muscle) => {
      acc[muscle.status]++;
      return acc;
    },
    { fatigued: 0, recovering: 0, ready: 0 }
  );

  const handleMuscleClick = (data: { muscle: string; data?: any }) => {
    // Find the muscle recovery data by the clicked muscle slug
    const clickedMuscle = recoveryData.find(m => {
      const slugs = musclesToSlugs([m.name]);
      return slugs.includes(data.muscle as any);
    });

    if (clickedMuscle) {
      if (selectedMuscle?.muscleId === clickedMuscle.muscleId) {
        setSelectedMuscle(null);
      } else {
        setSelectedMuscle(clickedMuscle);
        // Position tooltip in center of diagram
        setTooltipPosition({ x: 100, y: 20 });
      }
    }
  };

  return (
    <NeuCard className="p-4 relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
        <h3 className="font-bold uppercase text-sm tracking-wide">Muscle Status</h3>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setViewSide('anterior')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wide transition-all border-2 border-border ${
            viewSide === 'anterior' 
              ? 'neu-pressed bg-primary text-primary-foreground' 
              : 'neu-flat hover:bg-muted'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setViewSide('posterior')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wide transition-all border-2 border-border ${
            viewSide === 'posterior' 
              ? 'neu-pressed bg-primary text-primary-foreground' 
              : 'neu-flat hover:bg-muted'
          }`}
        >
          Back
        </button>
      </div>

      {/* Body Diagram */}
      <div className="neu-pressed p-4 bg-muted/20 relative">
        {isLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        ) : (
          <Model
            data={buildMuscleData()}
            style={{ width: '100%', padding: '0.5rem' }}
            type={viewSide}
            bodyColor="#6B7280"
            highlightedColors={[
              '#F59E0B', // frequency 1 = Recovering (amber)
              '#EF4444', // frequency 2 = Fatigued (red)
            ]}
            onClick={handleMuscleClick}
          />
        )}

        {/* Tooltip */}
        {selectedMuscle && (
          <MuscleTooltip muscle={selectedMuscle} position={tooltipPosition} />
        )}
      </div>

      {/* Click hint */}
      <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
        Click a muscle for details
      </p>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
          <span className="text-muted-foreground">{statusCounts.fatigued} Fatigued</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
          <span className="text-muted-foreground">{statusCounts.recovering} Recovering</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6B7280' }} />
          <span className="text-muted-foreground">{statusCounts.ready} Ready</span>
        </div>
      </div>
    </NeuCard>
  );
};
