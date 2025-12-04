import { MuscleRecoveryStatus } from '@/hooks/useMuscleRecoveryStatus';
import { Clock, Dumbbell, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MuscleTooltipProps {
  muscle: MuscleRecoveryStatus | null;
  exercises?: string[];
  position: { x: number; y: number };
}

export const MuscleTooltip = ({ muscle, exercises = [], position }: MuscleTooltipProps) => {
  if (!muscle) return null;

  const statusColor = {
    fatigued: 'text-destructive',
    recovering: 'text-warning',
    ready: 'text-accent'
  }[muscle.status];

  const statusLabel = {
    fatigued: 'Fatigued',
    recovering: 'Recovering',
    ready: 'Ready'
  }[muscle.status];

  return (
    <div 
      className="absolute z-50 neu-flat bg-card border-2 border-border p-3 min-w-[200px] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-8px)'
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold uppercase text-sm">{muscle.name}</h4>
          <span className={`text-xs font-mono ${statusColor}`}>{statusLabel}</span>
        </div>
        
        <div className="h-px bg-border" />
        
        <div className="space-y-1.5 text-xs">
          {muscle.lastWorked ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Last worked: {formatDistanceToNow(muscle.lastWorked, { addSuffix: true })}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Not worked recently</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            <span>Recovery: {muscle.recoveryPercent}%</span>
            {muscle.hoursRemaining > 0 && (
              <span className="text-muted-foreground/70">({muscle.hoursRemaining}h left)</span>
            )}
          </div>
          
          {/* Recovery progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full transition-all ${
                muscle.status === 'fatigued' ? 'bg-destructive' :
                muscle.status === 'recovering' ? 'bg-warning' : 'bg-accent'
              }`}
              style={{ width: `${muscle.recoveryPercent}%` }}
            />
          </div>
        </div>

        {exercises.length > 0 && (
          <>
            <div className="h-px bg-border mt-2" />
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Dumbbell className="h-3 w-3" />
                <span>Exercises:</span>
              </div>
              <ul className="text-xs space-y-0.5">
                {exercises.slice(0, 4).map((ex, i) => (
                  <li key={i} className="text-foreground/80">• {ex}</li>
                ))}
                {exercises.length > 4 && (
                  <li className="text-muted-foreground">+{exercises.length - 4} more</li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
