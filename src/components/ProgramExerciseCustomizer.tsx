import { useState } from "react";
import { Workout, Exercise, ProgramType } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { AddExerciseSheet } from "@/components/AddExerciseSheet";
import { toast } from "sonner";

interface ProgramExerciseCustomizerProps {
  programType: ProgramType;
  onBack: () => void;
}

export function ProgramExerciseCustomizer({ programType, onBack }: ProgramExerciseCustomizerProps) {
  const { workouts, systemTemplates, saveUserTemplate, resetUserTemplate, isLoading } = useWorkoutTemplates(programType);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [editedExercises, setEditedExercises] = useState<Exercise[]>([]);
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const selectedWorkout = workouts.find(w => w.id === selectedTemplateId);
  const baseTemplate = systemTemplates.find(t => t.id === selectedTemplateId || 
    (selectedWorkout && 'baseTemplateId' in selectedWorkout && selectedWorkout.baseTemplateId === t.id));

  const handleSelectTemplate = (workout: Workout) => {
    setSelectedTemplateId(workout.id);
    setEditedExercises([...workout.exercises]);
    setHasChanges(false);
  };

  const handleAddExercise = (exercise: Exercise) => {
    setEditedExercises(prev => [...prev, exercise]);
    setHasChanges(true);
  };

  const handleRemoveExercise = (index: number) => {
    setEditedExercises(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleMoveExercise = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editedExercises.length) return;
    const newExercises = [...editedExercises];
    const [moved] = newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, moved);
    setEditedExercises(newExercises);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedWorkout || !baseTemplate) return;

    try {
      await saveUserTemplate.mutateAsync({
        baseTemplateId: baseTemplate.id,
        title: baseTemplate.title,
        description: baseTemplate.description,
        dayLabel: baseTemplate.day,
        exercises: editedExercises,
        sortOrder: workouts.findIndex(w => w.id === selectedTemplateId),
      });
      toast.success("Workout customized successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save customization");
    }
  };

  const handleReset = async () => {
    if (!baseTemplate) return;

    try {
      await resetUserTemplate.mutateAsync(baseTemplate.id);
      // Reload from system template
      const systemWorkout = systemTemplates.find(t => t.id === baseTemplate.id);
      if (systemWorkout) {
        setEditedExercises([...systemWorkout.exercises]);
      }
      toast.success("Reset to default exercises");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to reset");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground font-mono">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NeuButton variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </NeuButton>
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Customize Program</h2>
          <p className="text-muted-foreground font-mono text-sm">
            Edit which exercises are in each workout day
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Workout Day Selector */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-sm text-muted-foreground">Workout Days</h3>
          {workouts.map((workout) => {
            const isCustomized = 'isCustomized' in workout && workout.isCustomized;
            return (
              <NeuCard
                key={workout.id}
                variant={selectedTemplateId === workout.id ? "pressed" : "raised"}
                className={`cursor-pointer ${selectedTemplateId === workout.id ? "bg-accent" : ""}`}
                onClick={() => handleSelectTemplate(workout)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{workout.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {workout.exercises.length} exercises
                    </p>
                  </div>
                  {isCustomized && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 uppercase font-bold">
                      Custom
                    </span>
                  )}
                </div>
              </NeuCard>
            );
          })}
        </div>

        {/* Exercise Editor */}
        <div className="lg:col-span-2 space-y-4">
          {selectedWorkout ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold uppercase">{selectedWorkout.title} Exercises</h3>
                <div className="flex gap-2">
                  {hasChanges && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <NeuButton size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </NeuButton>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {editedExercises.map((exercise, index) => (
                  <NeuCard key={`${exercise.id}-${index}`} variant="flat" className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveExercise(index, index - 1)}
                          disabled={index === 0}
                          className="p-1 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleMoveExercise(index, index + 1)}
                          disabled={index === editedExercises.length - 1}
                          className="p-1 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{exercise.name}</p>
                        <Badge variant="outline" className="text-xs font-mono uppercase">
                          {exercise.muscleGroup}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </NeuCard>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-2"
                  onClick={() => setAddExerciseOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </>
          ) : (
            <NeuCard variant="flat" className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground font-mono text-center">
                Select a workout day to customize its exercises
              </p>
            </NeuCard>
          )}
        </div>
      </div>

      <AddExerciseSheet
        open={addExerciseOpen}
        onOpenChange={setAddExerciseOpen}
        onAddExercise={handleAddExercise}
        existingExerciseIds={editedExercises.map(e => e.id)}
      />
    </div>
  );
}
