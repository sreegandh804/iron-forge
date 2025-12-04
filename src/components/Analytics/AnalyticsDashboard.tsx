import { useState } from 'react';
import { NeuCard } from '@/components/ui/neu-card';
import { BarChart3 } from 'lucide-react';
import { useWorkoutAnalytics } from '@/hooks/useWorkoutAnalytics';
import { WeightProgressionChart } from './WeightProgressionChart';
import { VolumeOverTimeChart } from './VolumeOverTimeChart';
import { MuscleFrequencyChart } from './MuscleFrequencyChart';
import { PersonalRecords } from './PersonalRecords';

type TimePeriod = 30 | 90 | 180 | 365;

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<TimePeriod>(90);
  const { data, isLoading } = useWorkoutAnalytics(period);

  const periodOptions: { value: TimePeriod; label: string }[] = [
    { value: 30, label: '30 Days' },
    { value: 90, label: '3 Months' },
    { value: 180, label: '6 Months' },
    { value: 365, label: '1 Year' },
  ];

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            Analytics
          </h2>
        </div>
        <NeuCard variant="flat" className="text-center py-8">
          <p className="text-muted-foreground font-mono">Loading analytics...</p>
        </NeuCard>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            Analytics
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            Track your progress over time
          </p>
        </div>
        
        {/* Time Period Filter */}
        <div className="flex gap-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide border-2 border-border transition-all ${
                period === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight Progression */}
        <NeuCard variant="raised" className="p-4">
          <h3 className="font-bold uppercase text-sm mb-4">Weight Progression</h3>
          <WeightProgressionChart data={data?.weightProgression || []} />
        </NeuCard>

        {/* Personal Records */}
        <NeuCard variant="raised" className="p-4">
          <h3 className="font-bold uppercase text-sm mb-4">Personal Records</h3>
          <PersonalRecords records={data?.personalRecords || []} />
        </NeuCard>

        {/* Volume Over Time */}
        <NeuCard variant="raised" className="p-4 lg:col-span-2">
          <h3 className="font-bold uppercase text-sm mb-4">Volume Over Time</h3>
          <VolumeOverTimeChart data={data?.volumeByWeek || []} />
        </NeuCard>

        {/* Muscle Frequency */}
        <NeuCard variant="raised" className="p-4 lg:col-span-2">
          <h3 className="font-bold uppercase text-sm mb-4">Muscle Group Training Frequency</h3>
          <MuscleFrequencyChart data={data?.muscleFrequency || []} />
        </NeuCard>
      </div>
    </section>
  );
}
