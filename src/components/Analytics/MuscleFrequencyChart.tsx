import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MuscleFrequency } from '@/hooks/useWorkoutAnalytics';

interface MuscleFrequencyChartProps {
  data: MuscleFrequency[];
}

const MUSCLE_COLORS: Record<string, string> = {
  'Chest': 'hsl(12, 76%, 61%)',
  'Back': 'hsl(173, 58%, 39%)',
  'Quadriceps': 'hsl(197, 37%, 34%)',
  'Shoulders': 'hsl(43, 74%, 66%)',
  'Biceps': 'hsl(27, 87%, 67%)',
  'Triceps': 'hsl(220, 70%, 50%)',
  'Hamstrings': 'hsl(160, 60%, 45%)',
  'Calves': 'hsl(280, 65%, 60%)',
};

export function MuscleFrequencyChart({ data }: MuscleFrequencyChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            type="category"
            dataKey="muscle"
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            width={75}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '2px solid hsl(var(--border))',
              borderRadius: 0,
            }}
            formatter={(value: number) => [`${value} sets`, 'Total Sets']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={MUSCLE_COLORS[entry.muscle] || `hsl(${index * 40}, 60%, 50%)`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
