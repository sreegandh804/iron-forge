import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WeightProgression } from '@/hooks/useWorkoutAnalytics';
import { format, parseISO } from 'date-fns';

interface WeightProgressionChartProps {
  data: WeightProgression[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function WeightProgressionChart({ data }: WeightProgressionChartProps) {
  // Get unique exercises
  const exercises = useMemo(() => {
    const unique = [...new Set(data.map(d => d.exercise))];
    return unique.slice(0, 5); // Limit to 5 exercises
  }, [data]);

  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Initialize selected exercises when data loads
  useEffect(() => {
    if (exercises.length > 0 && selectedExercises.length === 0) {
      setSelectedExercises(exercises.slice(0, 3));
    }
  }, [exercises]);

  // Transform data for chart
  const chartData = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {};
    
    data.forEach(d => {
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
  }, [data, selectedExercises]);

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
      {/* Exercise Filter */}
      <div className="flex flex-wrap gap-2">
        {exercises.map((exercise, idx) => (
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
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[idx % COLORS.length], strokeWidth: 0, r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
