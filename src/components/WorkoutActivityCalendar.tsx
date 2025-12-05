import { useMemo } from "react";
import { useWorkoutDates } from "@/hooks/useWorkoutDates";
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  subWeeks,
  isSameDay,
  getDay,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Flame } from "lucide-react";

const WEEKS_TO_SHOW = 60;
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function WorkoutActivityCalendar() {
  const { data: workoutDates, isLoading } = useWorkoutDates();

  const { weeks, currentStreak, bestStreak } = useMemo(() => {
    const today = new Date();
    const endDate = endOfWeek(today);
    const startDate = startOfWeek(subWeeks(today, WEEKS_TO_SHOW - 1));

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Group days into weeks
    const weeksArray: Date[][] = [];
    let currentWeek: Date[] = [];

    allDays.forEach((day) => {
      if (currentWeek.length === 7) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) {
      weeksArray.push(currentWeek);
    }

    // Calculate streaks
    let current = 0;
    let best = 0;
    let tempStreak = 0;

    // Sort days in reverse order to calculate current streak
    const sortedDays = [...allDays].reverse();
    let foundFirstWorkout = false;

    sortedDays.forEach((day, index) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const hasWorkout = workoutDates?.has(dateKey);

      if (hasWorkout) {
        tempStreak++;
        foundFirstWorkout = true;
        if (tempStreak > best) best = tempStreak;
      } else {
        if (foundFirstWorkout && index > 0) {
          // Allow one day gap for current streak calculation
          if (index === 1) {
            // Skip today if no workout yet
          } else {
            tempStreak = 0;
          }
        }
      }
    });

    // Recalculate current streak properly
    current = 0;
    for (let i = 0; i < sortedDays.length; i++) {
      const dateKey = format(sortedDays[i], "yyyy-MM-dd");
      const hasWorkout = workoutDates?.has(dateKey);
      if (hasWorkout) {
        current++;
      } else if (i > 0) {
        // Allow skipping today if no workout yet
        break;
      }
    }

    return { weeks: weeksArray, currentStreak: current, bestStreak: best };
  }, [workoutDates]);

  if (isLoading) {
    return (
      <div className="bg-card border-2 border-border p-4 shadow-sm">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted w-24" />
          <div className="h-20 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-orange-500" />
        <h3 className="font-bold uppercase tracking-tight text-sm">Activity</h3>
      </div>

      {/* Streaks */}
      <div className="flex gap-4 mb-4 text-xs font-mono">
        <div>
          <span className="text-muted-foreground">Current:</span>{" "}
          <span className="font-bold">{currentStreak} days</span>
        </div>
        <div>
          <span className="text-muted-foreground">Best:</span>{" "}
          <span className="font-bold">{bestStreak} days</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="w-3 h-3 text-[8px] text-muted-foreground flex items-center justify-center font-mono"
            >
              {i % 2 === 1 ? label : ""}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const workoutCount = workoutDates?.get(dateKey) || 0;
              const hasWorkout = workoutCount > 0;
              const isToday = isSameDay(day, new Date());

              return (
                <Tooltip key={dateKey}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        w-3 h-3 rounded-sm transition-all cursor-pointer
                        ${
                          hasWorkout
                            ? "bg-[hsl(var(--glow-workout))] shadow-[0_0_6px_hsl(var(--glow-workout))]"
                            : "bg-muted/50"
                        }
                        ${isToday ? "ring-1 ring-foreground" : ""}
                        ${workoutCount > 1 ? "shadow-[0_0_10px_hsl(var(--glow-workout))]" : ""}
                      `}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-mono text-xs">
                    <p>{format(day, "MMM d, yyyy")}</p>
                    {hasWorkout ? (
                      <p className="text-[hsl(var(--glow-workout))]">
                        {workoutCount} workout{workoutCount > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="text-muted-foreground">No workout</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground font-mono">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-muted/50" />
          <span>No workout</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[hsl(var(--glow-workout))] shadow-[0_0_4px_hsl(var(--glow-workout))]" />
          <span>Workout</span>
        </div>
      </div>
    </div>
  );
}
