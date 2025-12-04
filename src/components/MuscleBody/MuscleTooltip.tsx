import { MuscleRecoveryStatus } from '@/hooks/useMuscleRecoveryStatus';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface MuscleTooltipProps {
  muscle: MuscleRecoveryStatus;
  position: { x: number; y: number };
}

export const MuscleTooltip = ({ muscle, position }: MuscleTooltipProps) => {
  const statusColors = {
    fatigued: 'text-red-500',
    recovering: 'text-amber-500',
    ready: 'text-green-500',
  };

  const statusBgColors = {
    fatigued: 'bg-red-500/20 border-red-500/50',
    recovering: 'bg-amber-500/20 border-amber-500/50',
    ready: 'bg-green-500/20 border-green-500/50',
  };

  return (
    <div
      className="absolute z-50 bg-card border-2 border-border shadow-md p-3 min-w-[200px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-8px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-sm uppercase">{muscle.name}</h4>
        <span
          className={`text-xs font-bold uppercase px-2 py-0.5 border ${statusBgColors[muscle.status]}`}
        >
          {muscle.status}
        </span>
      </div>

      {/* Recovery Progress */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Recovery</span>
          <span className={`font-mono font-bold ${statusColors[muscle.status]}`}>
            {muscle.recoveryPercent}%
          </span>
        </div>
        <Progress value={muscle.recoveryPercent} className="h-2" />
      </div>

      {/* Details */}
      <div className="space-y-1 text-xs">
        {muscle.lastWorked ? (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Worked</span>
              <span className="font-mono">
                {formatDistanceToNow(muscle.lastWorked, { addSuffix: true })}
              </span>
            </div>
            {muscle.hoursRemaining > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Until Ready</span>
                <span className="font-mono">{Math.round(muscle.hoursRemaining)}h</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-muted-foreground text-center py-1">
            No recent workout data
          </div>
        )}
      </div>

      {/* Arrow pointer */}
      <div
        className="absolute left-1/2 bottom-0 w-3 h-3 bg-card border-r-2 border-b-2 border-border"
        style={{
          transform: 'translate(-50%, 50%) rotate(45deg)',
        }}
      />
    </div>
  );
};
