import { useState, useMemo } from "react";
import { useWorkoutDates } from "@/hooks/useWorkoutDates";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths,
  getDay,
  isToday
} from "date-fns";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WorkoutActivityCalendar() {
  const { data: workoutDates, isLoading } = useWorkoutDates();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const workoutDaysSet = useMemo(() => {
    if (!workoutDates || workoutDates.size === 0) {
      return new Set<string>();
    }
    return new Set(workoutDates.keys());
  }, [workoutDates]);

  // Calculate days worked in the currently displayed month
  const daysWorkedThisMonth = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.filter(day => workoutDaysSet.has(format(day, 'yyyy-MM-dd'))).length;
  }, [currentMonth, workoutDaysSet]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    const firstDayOfWeek = getDay(monthStart);
    const mondayBasedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Add empty slots for days before the month starts
    const emptySlots = Array(mondayBasedFirstDay).fill(null);
    
    return [...emptySlots, ...days];
  }, [currentMonth]);

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  if (isLoading) {
    return (
      <div className="bg-card border-2 border-border p-4 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted w-1/3"></div>
          <div className="h-32 bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="font-mono text-sm font-bold tracking-wider uppercase">Activity</span>
      </div>

      {/* Days This Month */}
      <div className="mb-4 text-xs font-mono">
        <span className="text-muted-foreground">This month: </span>
        <span className="font-bold">{daysWorkedThisMonth} days</span>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono text-sm font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button 
          onClick={goToNextMonth}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map(day => (
          <div key={day} className="text-center text-[10px] font-mono text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = format(day, 'yyyy-MM-dd');
          const workoutCount = workoutDates?.get(dateStr) || 0;
          const hasWorkout = workoutCount > 0;
          const isCurrentDay = isToday(day);

          return (
            <Tooltip key={dateStr}>
              <TooltipTrigger asChild>
                <div
                  className={`
                    aspect-square flex items-center justify-center text-[10px] font-mono
                    border-2 border-border rounded-sm transition-all cursor-default
                    ${hasWorkout 
                      ? 'bg-[hsl(var(--glow-workout))]/20 border-[hsl(var(--glow-workout))]/50 text-[hsl(var(--glow-workout))] shadow-[0_0_8px_hsl(var(--glow-workout)/0.4)]' 
                      : 'bg-muted/30 text-muted-foreground'
                    }
                    ${isCurrentDay ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                  `}
                >
                  {format(day, 'd')}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">
                  {format(day, 'MMM d, yyyy')}
                </p>
                {hasWorkout ? (
                  <p className="text-[hsl(var(--glow-workout))] text-xs">
                    {workoutCount} workout{workoutCount > 1 ? 's' : ''}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-xs">No workout</p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-muted/30 border-2 border-border rounded-sm" />
          <span>No workout</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[hsl(var(--glow-workout))]/20 border-2 border-[hsl(var(--glow-workout))]/50 rounded-sm shadow-[0_0_4px_hsl(var(--glow-workout)/0.4)]" />
          <span>Workout</span>
        </div>
      </div>
    </div>
  );
}
