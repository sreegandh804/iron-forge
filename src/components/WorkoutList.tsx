import { Workout, ProgramType } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { ChevronRight, Target, AlertCircle } from "lucide-react";
import { useMemo } from "react";

interface WorkoutListProps {
  workouts: Workout[];
  programType: ProgramType;
  onSelectWorkout: (workout: Workout) => void;
  availableEquipmentIds?: string[];
}

const programColors: Record<ProgramType, string> = {
  'full-body': 'border-l-[hsl(var(--program-full-body))]',
  'ppl': 'border-l-[hsl(var(--program-ppl))]',
  'upper-lower': 'border-l-[hsl(var(--program-upper-lower))]',
  'custom': 'border-l-primary',
};

export function WorkoutList({ workouts, programType, onSelectWorkout, availableEquipmentIds }: WorkoutListProps) {
  const filteredWorkouts = workouts.filter((w) => w.programType === programType);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Recommended Workouts</h2>
        <p className="text-muted-foreground font-mono text-sm">
          {filteredWorkouts.length} workouts in your program
        </p>
      </div>

      <div className="space-y-4">
        {filteredWorkouts.map((workout) => {
          // Filter exercises by available equipment
          const availableExercises = availableEquipmentIds
            ? workout.exercises.filter(ex => !ex.equipmentId || availableEquipmentIds.includes(ex.equipmentId))
            : workout.exercises;
          
          const unavailableCount = workout.exercises.length - availableExercises.length;
          
          // Create a modified workout with only available exercises
          const displayWorkout: Workout = {
            ...workout,
            exercises: availableExercises,
          };
          
          return (
            <NeuCard
              key={workout.id}
              variant="raised"
              className={`border-l-8 ${programColors[programType]} cursor-pointer`}
              onClick={() => onSelectWorkout(displayWorkout)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {workout.day && (
                      <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-bold uppercase">
                        {workout.day}
                      </span>
                    )}
                    <h3 className="text-xl font-bold">{workout.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{workout.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {availableExercises.length} exercises
                    </span>
                    {unavailableCount > 0 && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <AlertCircle className="h-3 w-3" />
                        {unavailableCount} skipped (no equipment)
                      </span>
                    )}
                    <span>
                      {[...new Set(availableExercises.map(e => e.muscleGroup))].join(' • ')}
                    </span>
                  </div>
                </div>
                <NeuButton variant="ghost" size="icon">
                  <ChevronRight className="h-6 w-6" />
                </NeuButton>
              </div>
            </NeuCard>
          );
        })}
      </div>
    </section>
  );
}
