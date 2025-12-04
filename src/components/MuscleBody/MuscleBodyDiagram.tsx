import { useState } from 'react';
import Model from 'react-body-highlighter';
import { NeuCard } from '@/components/ui/neu-card';
import { useMuscleRecoveryStatus } from '@/hooks/useMuscleRecoveryStatus';
import { Activity } from 'lucide-react';
import { musclesToSlugs } from './muscleMapping';

export const MuscleBodyDiagram = () => {
  const [viewSide, setViewSide] = useState<'anterior' | 'posterior'>('anterior');
  const { data: recoveryData = [], isLoading } = useMuscleRecoveryStatus();

  // Build exercise data for the model based on recovery status
  const buildMuscleData = () => {
    // Group by status and build data
    const fatigued = recoveryData.filter(m => m.status === 'fatigued');
    const recovering = recoveryData.filter(m => m.status === 'recovering');
    const ready = recoveryData.filter(m => m.status === 'ready');

    return [
      ...(fatigued.length > 0 ? [{
        name: 'Fatigued',
        muscles: musclesToSlugs(fatigued.map(m => m.name)) as any[],
      }] : []),
      ...(recovering.length > 0 ? [{
        name: 'Recovering', 
        muscles: musclesToSlugs(recovering.map(m => m.name)) as any[],
      }] : []),
      ...(ready.length > 0 ? [{
        name: 'Ready',
        muscles: musclesToSlugs(ready.map(m => m.name)) as any[],
      }] : []),
    ];
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
      <div className="neu-pressed p-4 bg-muted/20">
        {isLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        ) : (
          <Model
            data={buildMuscleData()}
            style={{ width: '100%', padding: '0.5rem' }}
            type={viewSide}
            highlightedColors={[
              'hsl(var(--destructive))',  // Fatigued - red
              'hsl(var(--warning))',       // Recovering - yellow
              'hsl(var(--accent))',        // Ready - green
            ]}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">{statusCounts.fatigued}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">{statusCounts.recovering}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent" />
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
