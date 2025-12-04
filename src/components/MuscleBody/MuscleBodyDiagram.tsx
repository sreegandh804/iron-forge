import { useState, useRef } from 'react';
import { NeuCard } from '@/components/ui/neu-card';
import { BodyFront } from './BodyFront';
import { BodyBack } from './BodyBack';
import { MuscleTooltip } from './MuscleTooltip';
import { useMuscleRecoveryStatus, MuscleRecoveryStatus } from '@/hooks/useMuscleRecoveryStatus';
import { useMuscleHighlight } from '@/context/MuscleHighlightContext';
import { Activity } from 'lucide-react';

type ViewSide = 'front' | 'back';

export const MuscleBodyDiagram = () => {
  const [viewSide, setViewSide] = useState<ViewSide>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleRecoveryStatus | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: recoveryData = [], isLoading } = useMuscleRecoveryStatus();
  const { setClickedMuscle, setHighlightMode } = useMuscleHighlight();

  const handleMuscleHover = (muscleName: string | null, event?: React.MouseEvent) => {
    if (!muscleName) {
      setHoveredMuscle(null);
      return;
    }
    
    const muscle = recoveryData.find(r => r.name === muscleName);
    if (muscle && event && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
      setHoveredMuscle(muscle);
    }
  };

  const handleMuscleClick = (muscleName: string) => {
    setClickedMuscle(muscleName);
    setHighlightMode('clicked');
  };

  // Count muscles by status
  const statusCounts = recoveryData.reduce(
    (acc, muscle) => {
      acc[muscle.status]++;
      return acc;
    },
    { fatigued: 0, recovering: 0, ready: 0 }
  );

  return (
    <NeuCard className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-accent" strokeWidth={2.5} />
        <h3 className="font-bold uppercase text-sm tracking-wide">Muscle Status</h3>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setViewSide('front')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wide transition-all border-2 border-border ${
            viewSide === 'front' 
              ? 'neu-pressed bg-primary text-primary-foreground' 
              : 'neu-flat hover:bg-muted'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setViewSide('back')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wide transition-all border-2 border-border ${
            viewSide === 'back' 
              ? 'neu-pressed bg-primary text-primary-foreground' 
              : 'neu-flat hover:bg-muted'
          }`}
        >
          Back
        </button>
      </div>

      {/* Body Diagram */}
      <div 
        ref={containerRef}
        className="relative neu-pressed p-4 bg-muted/20"
      >
        {isLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        ) : (
          <>
            {viewSide === 'front' ? (
              <BodyFront 
                recoveryData={recoveryData}
                onMuscleHover={handleMuscleHover}
                onMuscleClick={handleMuscleClick}
              />
            ) : (
              <BodyBack 
                recoveryData={recoveryData}
                onMuscleHover={handleMuscleHover}
                onMuscleClick={handleMuscleClick}
              />
            )}
            
            {/* Tooltip */}
            {hoveredMuscle && (
              <MuscleTooltip 
                muscle={hoveredMuscle}
                position={tooltipPosition}
              />
            )}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive muscle-glow-fatigued" />
          <span className="text-muted-foreground">{statusCounts.fatigued}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-warning muscle-glow-recovering" />
          <span className="text-muted-foreground">{statusCounts.recovering}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent muscle-glow-ready" />
          <span className="text-muted-foreground">{statusCounts.ready}</span>
        </div>
      </div>

      {/* Status Labels */}
      <div className="flex items-center justify-between mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>Fatigued</span>
        <span>Recovering</span>
        <span>Ready</span>
      </div>
    </NeuCard>
  );
};
