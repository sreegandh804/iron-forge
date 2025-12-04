import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VolumeData } from '@/hooks/useWorkoutAnalytics';
import { format, parseISO } from 'date-fns';

interface VolumeOverTimeChartProps {
  data: VolumeData[];
}

const MUSCLE_COLORS: Record<string, string> = {
  'Chest': 'hsl(var(--chart-1))',
  'Back': 'hsl(var(--chart-2))',
  'Quadriceps': 'hsl(var(--chart-3))',
  'Shoulders': 'hsl(var(--chart-4))',
  'Biceps': 'hsl(var(--chart-5))',
  'Triceps': 'hsl(12, 76%, 51%)',
  'Hamstrings': 'hsl(173, 58%, 49%)',
  'Calves': 'hsl(197, 37%, 34%)',
};

export function VolumeOverTimeChart({ data }: VolumeOverTimeChartProps) {
  // Get all unique muscle groups
  const muscleGroups = useMemo(() => {
    const muscles = new Set<string>();
    data.forEach(d => {
      Object.keys(d.muscleVolumes).forEach(m => muscles.add(m));
    });
    return Array.from(muscles);
  }, [data]);

  // Transform data for stacked area chart
  const chartData = useMemo(() => {
    return data.map(d => ({
      week: format(parseISO(d.week), 'MMM d'),
      ...d.muscleVolumes,
      total: d.totalVolume,
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid hsl(var(--border))',
                borderRadius: 0,
              }}
              formatter={(value: number) => [`${value.toLocaleString()} kg`, '']}
            />
            {muscleGroups.map((muscle, idx) => (
              <Area
                key={muscle}
                type="monotone"
                dataKey={muscle}
                stackId="1"
                stroke={MUSCLE_COLORS[muscle] || `hsl(${idx * 40}, 70%, 50%)`}
                fill={MUSCLE_COLORS[muscle] || `hsl(${idx * 40}, 70%, 50%)`}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {muscleGroups.map((muscle, idx) => (
          <div key={muscle} className="flex items-center gap-1.5 text-xs">
            <div 
              className="w-3 h-3" 
              style={{ 
                backgroundColor: MUSCLE_COLORS[muscle] || `hsl(${idx * 40}, 70%, 50%)` 
              }} 
            />
            <span className="text-muted-foreground">{muscle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
