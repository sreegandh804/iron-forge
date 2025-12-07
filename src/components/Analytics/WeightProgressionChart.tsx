import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightProgression } from '@/hooks/useWorkoutAnalytics';
import { format, parseISO, subDays, startOfYear, isAfter } from 'date-fns';

import { VolumeData } from '@/hooks/useWorkoutAnalytics';

interface WeightProgressionChartProps {
  data: WeightProgression[];
  volumeData?: VolumeData[];
}

type TimeRange = '1M' | '3M' | '6M' | 'YTD' | 'ALL';
type ViewMode = 'exercise' | 'muscle';
type MuscleMetric = 'weight' | 'volume';

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

export function WeightProgressionChart({ data, volumeData = [] }: WeightProgressionChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('YTD');
  const [viewMode, setViewMode] = useState<ViewMode>('exercise');
  const [muscleMetric, setMuscleMetric] = useState<MuscleMetric>('weight');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

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

  // Get unique muscle groups from filtered data - using all targeted muscles
  const muscleGroups = useMemo(() => {
    const muscles = new Set<string>();
    filteredData.forEach(d => {
      if (d.muscleGroups && d.muscleGroups.length > 0) {
        d.muscleGroups.forEach(m => muscles.add(m));
      } else {
        muscles.add(d.muscleGroup);
      }
    });
    return [...muscles];
  }, [filteredData]);

  // Initialize selected exercises when data loads - select all by default
  useEffect(() => {
    if (exercises.length > 0 && selectedExercises.length === 0) {
      setSelectedExercises(exercises);
    }
  }, [exercises]);

  // Initialize selected muscles when data loads - select all by default
  useEffect(() => {
    if (muscleGroups.length > 0 && selectedMuscles.length === 0) {
      setSelectedMuscles(muscleGroups);
    }
  }, [muscleGroups]);

  // Transform data for chart - by exercise
  const chartDataByExercise = useMemo(() => {
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

  // Transform data for chart - by muscle group (aggregate max weight per muscle per date)
  const chartDataByMuscleWeight = useMemo(() => {
    const dateMap: Record<string, Record<string, number>> = {};
    
    filteredData.forEach(d => {
      // Get all muscles for this data point
      const targetedMuscles = d.muscleGroups && d.muscleGroups.length > 0 
        ? d.muscleGroups 
        : [d.muscleGroup];
      
      targetedMuscles.forEach(muscle => {
        if (!selectedMuscles.includes(muscle)) return;
        
        if (!dateMap[d.date]) {
          dateMap[d.date] = {};
        }
        // Take max weight across all exercises for this muscle on this date
        const currentMax = dateMap[d.date][muscle] || 0;
        dateMap[d.date][muscle] = Math.max(currentMax, d.maxWeight);
      });
    });

    return Object.entries(dateMap)
      .map(([date, muscles]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM d'),
        ...muscles,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData, selectedMuscles]);

  // Transform data for chart - by muscle group volume (weekly total volume per muscle)
  const chartDataByMuscleVolume = useMemo(() => {
    if (!volumeData || volumeData.length === 0) return [];
    
    // Filter volume data by time range
    const now = new Date();
    let cutoffDate: Date | null = null;
    
    switch (timeRange) {
      case '1M': cutoffDate = subDays(now, 30); break;
      case '3M': cutoffDate = subDays(now, 90); break;
      case '6M': cutoffDate = subDays(now, 180); break;
      case 'YTD': cutoffDate = startOfYear(now); break;
      default: cutoffDate = null;
    }

    const filtered = cutoffDate 
      ? volumeData.filter(v => isAfter(parseISO(v.week), cutoffDate!))
      : volumeData;

    return filtered
      .map(v => {
        const muscleVolumes: Record<string, number> = {};
        Object.entries(v.muscleVolumes).forEach(([muscle, vol]) => {
          if (selectedMuscles.includes(muscle)) {
            muscleVolumes[muscle] = vol;
          }
        });
        return {
          date: v.week,
          formattedDate: format(parseISO(v.week), 'MMM d'),
          ...muscleVolumes,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [volumeData, timeRange, selectedMuscles]);

  const chartDataByMuscle = muscleMetric === 'weight' ? chartDataByMuscleWeight : chartDataByMuscleVolume;

  const chartData = viewMode === 'exercise' ? chartDataByExercise : chartDataByMuscle;
  const selectedItems = viewMode === 'exercise' ? selectedExercises : selectedMuscles;

  const toggleExercise = (exercise: string) => {
    setSelectedExercises(prev =>
      prev.includes(exercise)
        ? prev.filter(e => e !== exercise)
        : [...prev, exercise]
    );
  };

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles(prev =>
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
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
      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setViewMode('exercise')}
          className={`px-3 py-1 text-xs font-mono font-bold border-2 border-border transition-all ${
            viewMode === 'exercise'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          By Exercise
        </button>
        <button
          onClick={() => setViewMode('muscle')}
          className={`px-3 py-1 text-xs font-mono font-bold border-2 border-border transition-all ${
            viewMode === 'muscle'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          By Muscle
        </button>

        {/* Muscle Metric Toggle - only show in muscle view */}
        {viewMode === 'muscle' && (
          <>
            <span className="text-muted-foreground mx-1">|</span>
            <button
              onClick={() => setMuscleMetric('weight')}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-border transition-all ${
                muscleMetric === 'weight'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              Max Weight
            </button>
            <button
              onClick={() => setMuscleMetric('volume')}
              className={`px-3 py-1 text-xs font-mono font-bold border-2 border-border transition-all ${
                muscleMetric === 'volume'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              Total Volume
            </button>
          </>
        )}
      </div>

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

      {/* Exercise/Muscle Filter */}
      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-2">
        {viewMode === 'exercise' ? (
          exercises.map((exercise) => (
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
          ))
        ) : (
          muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => toggleMuscle(muscle)}
              className={`px-2 py-1 text-xs font-mono border-2 border-border transition-all ${
                selectedMuscles.includes(muscle)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {muscle}
            </button>
          ))
        )}
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
              unit={viewMode === 'muscle' && muscleMetric === 'volume' ? '' : 'kg'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid hsl(var(--border))',
                borderRadius: 0,
              }}
            />
            {selectedItems.map((item, idx) => (
              <Line
                key={item}
                type="monotone"
                dataKey={item}
                stroke={generateColor(idx, selectedItems.length)}
                strokeWidth={2}
                dot={{ fill: generateColor(idx, selectedItems.length), strokeWidth: 0, r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
