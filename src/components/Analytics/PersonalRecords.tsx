import { PersonalRecord } from '@/hooks/useWorkoutAnalytics';
import { format, parseISO } from 'date-fns';
import { Trophy } from 'lucide-react';

interface PersonalRecordsProps {
  records: PersonalRecord[];
}

export function PersonalRecords({ records }: PersonalRecordsProps) {
  if (records.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No records available
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto">
      {records.slice(0, 10).map((record, idx) => (
        <div
          key={record.exercise}
          className={`flex items-center justify-between p-3 border-2 border-border ${
            idx === 0 ? 'bg-amber-500/10 border-amber-500/50' : 'bg-muted/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {idx < 3 && (
              <Trophy 
                className={`h-4 w-4 ${
                  idx === 0 ? 'text-amber-500' : 
                  idx === 1 ? 'text-slate-400' : 
                  'text-amber-700'
                }`} 
              />
            )}
            <div>
              <div className="font-bold text-sm">{record.exercise}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {format(parseISO(record.date), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold font-mono text-lg">{record.weight}kg</div>
            <div className="text-xs text-muted-foreground font-mono">
              × {record.reps} reps
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
