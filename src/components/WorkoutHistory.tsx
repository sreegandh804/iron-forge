import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NeuCard } from "@/components/ui/neu-card";
import { History, TrendingUp, Calendar, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { WorkoutHistoryDetail } from "./WorkoutHistoryDetail";
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
import { Button } from "@/components/ui/button";

interface WorkoutLogWithSets {
  id: string;
  workout_title: string;
  workout_description: string | null;
  program_type: string;
  completed_at: string;
  total_volume: number;
  total_sets: number;
}

interface ExerciseSet {
  exercise_name: string;
  muscle_group: string;
  weight: number;
  reps: number;
  set_number: number;
}

export function WorkoutHistory() {
  const [logs, setLogs] = useState<WorkoutLogWithSets[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLogWithSets | null>(null);
  const [selectedWorkoutSets, setSelectedWorkoutSets] = useState<ExerciseSet[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchWorkoutLogs();
  }, []);

  const fetchWorkoutLogs = async () => {
    const { data: workoutLogs, error } = await supabase
      .from("workout_logs")
      .select("*")
      .order("completed_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching workout logs:", error);
      setLoading(false);
      return;
    }

    if (!workoutLogs || workoutLogs.length === 0) {
      setLogs([]);
      setLoading(false);
      return;
    }

    // Fetch sets for each workout log
    const logsWithVolume = await Promise.all(
      workoutLogs.map(async (log) => {
        const { data: sets } = await supabase
          .from("exercise_sets")
          .select("weight, reps")
          .eq("workout_log_id", log.id);

        const totalVolume = sets?.reduce(
          (acc, set) => acc + Number(set.weight) * set.reps,
          0
        ) || 0;

        return {
          ...log,
          total_volume: totalVolume,
          total_sets: sets?.length || 0,
        };
      })
    );

    setLogs(logsWithVolume);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      // Delete all exercise sets first (foreign key constraint)
      const { error: setsError } = await supabase
        .from("exercise_sets")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (setsError) throw setsError;

      // Then delete all workout logs
      const { error: logsError } = await supabase
        .from("workout_logs")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (logsError) throw logsError;

      setLogs([]);
      toast.success("Workout history cleared");
    } catch (error: any) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history: " + error.message);
    } finally {
      setClearing(false);
    }
  };

  const handleViewDetails = async (workout: WorkoutLogWithSets) => {
    // Fetch sets for this workout
    const { data: sets, error } = await supabase
      .from("exercise_sets")
      .select("exercise_name, muscle_group, weight, reps, set_number")
      .eq("workout_log_id", workout.id)
      .order("set_number", { ascending: true });

    if (error) {
      console.error("Error fetching workout sets:", error);
      toast.error("Failed to load workout details");
      return;
    }

    setSelectedWorkout(workout);
    setSelectedWorkoutSets(sets || []);
    setDetailOpen(true);
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
            <History className="h-6 w-6" />
            Workout History
          </h2>
        </div>
        <NeuCard variant="flat" className="text-center py-8">
          <p className="text-muted-foreground font-mono">Loading...</p>
        </NeuCard>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
            <History className="h-6 w-6" />
            Workout History
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            {logs.length} recent sessions
          </p>
        </div>

        {logs.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-2">
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="uppercase font-bold">
                  Clear All History?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all workout logs and exercise data. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearHistory}
                  disabled={clearing}
                  className="bg-destructive text-destructive-foreground"
                >
                  {clearing ? "Clearing..." : "Clear All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {logs.length === 0 ? (
        <NeuCard variant="flat" className="text-center py-8">
          <p className="text-muted-foreground font-mono">
            No workouts logged yet. Complete a workout to see your history!
          </p>
        </NeuCard>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
          {logs.map((log) => (
            <NeuCard 
              key={log.id} 
              variant="raised"
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleViewDetails(log)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{log.workout_title}</h3>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {log.workout_description && (
                    <p className="text-sm text-muted-foreground">
                      {log.workout_description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(log.completed_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    <span className="uppercase bg-muted px-2 py-0.5 border border-border">
                      {log.program_type.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold font-mono">
                      {log.total_volume.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono uppercase">
                    Total Volume (kg)
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {log.total_sets} sets completed
                  </p>
                </div>
              </div>
            </NeuCard>
          ))}
        </div>
      )}

      <WorkoutHistoryDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        workout={selectedWorkout}
        sets={selectedWorkoutSets}
      />
    </section>
  );
}
