import { useState, useEffect } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Play, Trash2, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Workout, Exercise, ExerciseSet } from "@/types/workout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InProgressWorkout {
  id: string;
  workout_title: string;
  workout_description: string | null;
  program_type: string;
  created_at: string;
  totalSets: number;
  totalVolume: number;
}

interface SavedExerciseSet {
  id: string;
  exercise_name: string;
  muscle_group: string;
  weight: number;
  reps: number;
  set_number: number;
  muscle_targets?: { muscle_group: string; target_type: string }[];
}

interface InProgressWorkoutsProps {
  onContinue: (workout: Workout, workoutLogId: string, savedSets: Record<string, ExerciseSet[]>) => void;
  refreshKey?: number;
}

export function InProgressWorkouts({ onContinue, refreshKey }: InProgressWorkoutsProps) {
  const [workouts, setWorkouts] = useState<InProgressWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [discarding, setDiscarding] = useState<string | null>(null);
  const [continuing, setContinuing] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInProgressWorkouts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: logs, error } = await supabase
          .from("workout_logs")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "in_progress")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch sets for each workout to calculate totals
        const workoutsWithStats = await Promise.all(
          (logs || []).map(async (log) => {
            const { data: sets } = await supabase
              .from("exercise_sets")
              .select("weight, reps")
              .eq("workout_log_id", log.id);

            const totalSets = sets?.length || 0;
            const totalVolume = sets?.reduce((acc, s) => acc + s.weight * s.reps, 0) || 0;

            return {
              id: log.id,
              workout_title: log.workout_title,
              workout_description: log.workout_description,
              program_type: log.program_type,
              created_at: log.created_at,
              totalSets,
              totalVolume,
            };
          })
        );

        setWorkouts(workoutsWithStats);
      } catch (error) {
        console.error("Error fetching in-progress workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressWorkouts();
  }, [user?.id, refreshKey]);

  const handleDiscard = async (workoutId: string) => {
    setDiscarding(workoutId);
    try {
      // First get the set IDs for this workout
      const { data: sets } = await supabase
        .from("exercise_sets")
        .select("id")
        .eq("workout_log_id", workoutId);

      if (sets && sets.length > 0) {
        const setIds = sets.map(s => s.id);
        // Delete muscle targets first
        await supabase
          .from("exercise_set_muscles")
          .delete()
          .in("exercise_set_id", setIds);
      }

      // Delete the exercise sets
      await supabase
        .from("exercise_sets")
        .delete()
        .eq("workout_log_id", workoutId);

      // Delete the workout log
      await supabase
        .from("workout_logs")
        .delete()
        .eq("id", workoutId);

      setWorkouts(prev => prev.filter(w => w.id !== workoutId));
      toast.success("Workout discarded");
    } catch (error) {
      console.error("Error discarding workout:", error);
      toast.error("Failed to discard workout");
    } finally {
      setDiscarding(null);
    }
  };

  const handleContinue = async (inProgressWorkout: InProgressWorkout) => {
    setContinuing(inProgressWorkout.id);
    try {
      // Fetch saved sets with muscle targets
      const { data: savedSets, error } = await supabase
        .from("exercise_sets")
        .select(`
          id,
          exercise_name,
          muscle_group,
          weight,
          reps,
          set_number
        `)
        .eq("workout_log_id", inProgressWorkout.id)
        .order("set_number");

      if (error) throw error;

      // Fetch muscle targets for all sets
      const setIds = savedSets?.map(s => s.id) || [];
      const { data: muscleTargets } = await supabase
        .from("exercise_set_muscles")
        .select("exercise_set_id, muscle_group, target_type")
        .in("exercise_set_id", setIds);

      // Group sets by exercise and reconstruct the workout
      const exerciseMap = new Map<string, { 
        name: string; 
        muscleGroup: string; 
        sets: ExerciseSet[];
        muscleTargets: { name: string; type: string }[];
      }>();

      savedSets?.forEach((set) => {
        const existingExercise = exerciseMap.get(set.exercise_name);
        const setMuscles = muscleTargets?.filter(mt => mt.exercise_set_id === set.id) || [];
        
        const exerciseSet: ExerciseSet = {
          id: set.id,
          exerciseId: set.exercise_name, // Will be updated below
          weight: set.weight,
          reps: set.reps,
          completed: true, // Saved sets are completed
        };

        if (existingExercise) {
          existingExercise.sets.push(exerciseSet);
        } else {
          exerciseMap.set(set.exercise_name, {
            name: set.exercise_name,
            muscleGroup: set.muscle_group,
            sets: [exerciseSet],
            muscleTargets: setMuscles.map(mt => ({ name: mt.muscle_group, type: mt.target_type })),
          });
        }
      });

      // Build exercises array
      const exercises: Exercise[] = [];
      const setsRecord: Record<string, ExerciseSet[]> = {};

      exerciseMap.forEach((data, exerciseName) => {
        const exerciseId = `resumed-${exerciseName}-${Date.now()}`;
        exercises.push({
          id: exerciseId,
          name: data.name,
          muscleGroup: data.muscleGroup,
          muscleTargets: data.muscleTargets.map(mt => ({
            name: mt.name,
            type: mt.type as "primary" | "secondary",
          })),
        });

        // Update exerciseId in sets and add to record
        setsRecord[exerciseId] = data.sets.map(set => ({
          ...set,
          exerciseId,
        }));
      });

      const workout: Workout = {
        id: inProgressWorkout.id,
        title: inProgressWorkout.workout_title,
        description: inProgressWorkout.workout_description || "",
        programType: inProgressWorkout.program_type as Workout["programType"],
        exercises,
      };

      onContinue(workout, inProgressWorkout.id, setsRecord);
    } catch (error) {
      console.error("Error continuing workout:", error);
      toast.error("Failed to load workout");
    } finally {
      setContinuing(null);
    }
  };

  if (loading) return null;
  if (workouts.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
          In-Progress Workouts
        </h2>
        <p className="text-muted-foreground font-mono text-xs sm:text-sm">
          Continue where you left off
        </p>
      </div>

      <div className="space-y-3">
        {workouts.map((workout) => (
          <NeuCard key={workout.id} variant="raised" className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{workout.workout_title}</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Started: {format(new Date(workout.created_at), "MMM d, h:mm a")}
                </p>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  {workout.totalSets} sets • {workout.totalVolume.toLocaleString()}kg volume
                </p>
              </div>
              <div className="flex gap-2">
                <NeuButton
                  variant="default"
                  onClick={() => handleContinue(workout)}
                  disabled={continuing === workout.id}
                  className="flex-1 sm:flex-none"
                >
                  {continuing === workout.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Continue
                </NeuButton>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <NeuButton
                      variant="outline"
                      size="icon"
                      disabled={discarding === workout.id}
                    >
                      {discarding === workout.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </NeuButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Discard Workout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your in-progress workout "{workout.workout_title}" 
                        with {workout.totalSets} saved sets. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDiscard(workout.id)}>
                        Discard
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </NeuCard>
        ))}
      </div>
    </section>
  );
}
