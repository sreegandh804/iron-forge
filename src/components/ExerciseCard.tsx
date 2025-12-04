import { CustomExercise } from "@/types/workout";
import { MuscleGroupBadge } from "@/components/MuscleGroupBadge";
import { X } from "lucide-react";
import { useExercises } from "@/hooks/useExercises";
import { useToast } from "@/hooks/use-toast";

interface ExerciseCardProps {
  exercise: CustomExercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { removeExercise } = useExercises();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await removeExercise.mutateAsync(exercise.id);
      toast({
        title: "Deleted",
        description: "Exercise removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exercise",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background border-2 border-border p-3 group">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2">
          <p className="font-bold">{exercise.name}</p>
          {exercise.description && (
            <p className="text-xs text-muted-foreground">{exercise.description}</p>
          )}
          <div className="flex flex-wrap gap-1">
            {exercise.primaryMuscles.map((m) => (
              <MuscleGroupBadge key={m.id} name={m.name} type="primary" />
            ))}
            {exercise.secondaryMuscles.map((m) => (
              <MuscleGroupBadge key={m.id} name={m.name} type="secondary" />
            ))}
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={removeExercise.isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
