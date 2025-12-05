import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightProgression } from '@/hooks/useWorkoutAnalytics';
import { format, parseISO, subDays, startOfYear, isAfter } from 'date-fns';

interface WeightProgressionChartProps {
  data: WeightProgression[];
}

type TimeRange = '1M' | '3M' | '6M' | 'YTD' | 'ALL';

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: '1M', label: '1M' },
  { key: '3M', label: '3M' },
  { key: '6M', label: '6M' },
  { key: 'YTD', label: 'YTD' },
  { key: 'ALL', label: 'ALL' },
];

// Generate distinct colors for any number of exercises
const generateColor = (index: number, total: number) => {
  const hue = (index * 360) / Math.max(total, 1);
  return `hsl(${hue}, 70%, 50%)`;
};

export function WeightProgressionChart({ data }: WeightProgressionChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('YTD');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Filter data by time range
  const filteredData = useMemo(() => {
    if (timeRange === 'ALL') return data;
    
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case '1M': cutoffDate = subDays(now, 30); break;
      case '3M': cutoffDate = subDays(now, 90); break;
      case '6M': cutoffDate = subDays(now, 180); break;
      case 'YTD': cutoffDate = startOfYear(now); break;
      default: return data;
    }
    
    return data.filter(d => isAfter(parseISO(d.date), cutoffDate));
  }, [data, timeRange]);

  // Get unique exercises from filtered data
  const exercises = useMemo(() => {
    return [...new Set(filteredData.map(d => d.exercise))];
  }, [filteredData]);

  // Initialize selected exercises when data loads - select all by default
  useEffect(() => {
    if (exercises.length > 0 && selectedExercises.length === 0) {
      setSelectedExercises(exercises);
    }
  }, [exercises]);

  // Transform data for chart
  const chartData = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {};
    
    filteredData.forEach(d => {
      if (!selectedExercises.includes(d.exercise)) return;
      
      if (!dateMap[d.date]) {
        dateMap[d.date] = {};
      }
      dateMap[d.date][d.exercise] = d.maxWeight;
    });

    return Object.entries(dateMap)
      .map(([date, exercises]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM d'),
        ...exercises,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData, selectedExercises]);

  const toggleExercise = (exercise: string) => {
    setSelectedExercises(prev =>
      prev.includes(exercise)
        ? prev.filter(e => e !== exercise)
        : [...prev, exercise]
    );
  };

  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Time Range Filter */}
      <div className="flex flex-wrap gap-2">
        {TIME_RANGES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeRange(key)}
            className={`px-3 py-1 text-xs font-mono font-bold border-2 border-border transition-all ${
              timeRange === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Exercise Filter */}
      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-2">
        {exercises.map((exercise) => (
          <button
            key={exercise}
            onClick={() => toggleExercise(exercise)}
            className={`px-2 py-1 text-xs font-mono border-2 border-border transition-all ${
              selectedExercises.includes(exercise)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            {exercise}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              unit="kg"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid hsl(var(--border))',
                borderRadius: 0,
              }}
            />
            {selectedExercises.map((exercise, idx) => (
              <Line
                key={exercise}
                type="monotone"
                dataKey={exercise}
                stroke={generateColor(idx, selectedExercises.length)}
                strokeWidth={2}
                dot={{ fill: generateColor(idx, selectedExercises.length), strokeWidth: 0, r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
