import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MuscleGroupSelector } from "@/components/MuscleGroupSelector";
import { useMuscleGroups } from "@/hooks/useMuscleGroups";
import { useExercises } from "@/hooks/useExercises";
import { useToast } from "@/hooks/use-toast";
import { CustomExercise } from "@/types/workout";

interface EditExerciseSheetProps {
  exercise: CustomExercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExerciseSheet({ exercise, open, onOpenChange }: EditExerciseSheetProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [primaryMuscleIds, setPrimaryMuscleIds] = useState<string[]>([]);
  const [secondaryMuscleIds, setSecondaryMuscleIds] = useState<string[]>([]);

  const { data: muscleGroups = [], isLoading } = useMuscleGroups();
  const { updateExercise } = useExercises();
  const { toast } = useToast();

  // Populate form when exercise changes
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDescription(exercise.description || "");
      setPrimaryMuscleIds(exercise.primaryMuscles.map(m => m.id));
      setSecondaryMuscleIds(exercise.secondaryMuscles.map(m => m.id));
    }
  }, [exercise]);

  const handleTogglePrimary = (id: string) => {
    setPrimaryMuscleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    // Remove from secondary if adding to primary
    if (!primaryMuscleIds.includes(id)) {
      setSecondaryMuscleIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleToggleSecondary = (id: string) => {
    setSecondaryMuscleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    // Remove from primary if adding to secondary
    if (!secondaryMuscleIds.includes(id)) {
      setPrimaryMuscleIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleSubmit = async () => {
    if (!exercise) return;

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Exercise name is required",
        variant: "destructive",
      });
      return;
    }

    if (primaryMuscleIds.length === 0) {
      toast({
        title: "Error",
        description: "Select at least one primary muscle group",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateExercise.mutateAsync({
        exerciseId: exercise.id,
        name: name.trim(),
        description: description.trim() || undefined,
        primaryMuscleIds,
        secondaryMuscleIds,
      });
      toast({
        title: "Success",
        description: "Exercise updated",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update exercise",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg border-l-4 border-border">
          <p className="text-muted-foreground font-mono text-sm">Loading...</p>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg border-l-4 border-border overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-bold uppercase tracking-wide">Edit Exercise</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Input
            placeholder="Exercise name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-border bg-background h-12 font-mono"
          />

          <Textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-border bg-background font-mono resize-none"
            rows={2}
          />

          <MuscleGroupSelector
            muscleGroups={muscleGroups}
            selectedIds={primaryMuscleIds}
            onToggle={handleTogglePrimary}
            label="Primary Muscles (main targets)"
          />

          <MuscleGroupSelector
            muscleGroups={muscleGroups}
            selectedIds={secondaryMuscleIds}
            onToggle={handleToggleSecondary}
            label="Secondary Muscles (supporting)"
          />

          <div className="flex gap-2 pt-4">
            <NeuButton
              onClick={handleSubmit}
              disabled={updateExercise.isPending}
            >
              {updateExercise.isPending ? "Saving..." : "Save Changes"}
            </NeuButton>
            <NeuButton variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </NeuButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
