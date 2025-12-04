import { useState } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MuscleGroupSelector } from "@/components/MuscleGroupSelector";
import { useMuscleGroups } from "@/hooks/useMuscleGroups";
import { useExercises } from "@/hooks/useExercises";
import { useToast } from "@/hooks/use-toast";

interface ExerciseFormProps {
  equipmentId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ExerciseForm({ equipmentId, onCancel, onSuccess }: ExerciseFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [primaryMuscleIds, setPrimaryMuscleIds] = useState<string[]>([]);
  const [secondaryMuscleIds, setSecondaryMuscleIds] = useState<string[]>([]);

  const { data: muscleGroups = [], isLoading } = useMuscleGroups();
  const { addExercise } = useExercises();
  const { toast } = useToast();

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
      await addExercise.mutateAsync({
        equipmentId,
        name: name.trim(),
        description: description.trim() || undefined,
        primaryMuscleIds,
        secondaryMuscleIds,
      });
      toast({
        title: "Success",
        description: "Exercise added",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add exercise",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <NeuCard variant="flat" className="border-dashed">
        <p className="text-muted-foreground font-mono text-sm">Loading...</p>
      </NeuCard>
    );
  }

  return (
    <NeuCard variant="flat" className="border-dashed space-y-4">
      <p className="font-bold uppercase tracking-wider">Add Exercise</p>
      
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

      <div className="flex gap-2 pt-2">
        <NeuButton
          onClick={handleSubmit}
          size="sm"
          disabled={addExercise.isPending}
        >
          {addExercise.isPending ? "Saving..." : "Save"}
        </NeuButton>
        <NeuButton variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </NeuButton>
      </div>
    </NeuCard>
  );
}
