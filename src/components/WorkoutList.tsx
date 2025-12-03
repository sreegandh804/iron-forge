import { Workout, ProgramType } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { ChevronRight, Target } from "lucide-react";

interface WorkoutListProps {
  workouts: Workout[];
  programType: ProgramType;
  onSelectWorkout: (workout: Workout) => void;
}

const programColors = {
  'full-body': 'border-l-[hsl(var(--program-full-body))]',
  'ppl': 'border-l-[hsl(var(--program-ppl))]',
  'upper-lower': 'border-l-[hsl(var(--program-upper-lower))]',
};

export function WorkoutList({ workouts, programType, onSelectWorkout }: WorkoutListProps) {
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
        {filteredWorkouts.map((workout) => (
          <NeuCard
            key={workout.id}
            variant="raised"
            className={`border-l-8 ${programColors[programType]} cursor-pointer`}
            onClick={() => onSelectWorkout(workout)}
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
                    {workout.exercises.length} exercises
                  </span>
                  <span>
                    {[...new Set(workout.exercises.map(e => e.muscleGroup))].join(' • ')}
                  </span>
                </div>
              </div>
              <NeuButton variant="ghost" size="icon">
                <ChevronRight className="h-6 w-6" />
              </NeuButton>
            </div>
          </NeuCard>
        ))}
      </div>
    </section>
  );
}
