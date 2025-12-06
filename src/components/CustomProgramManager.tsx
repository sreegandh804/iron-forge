import { useState } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Plus, Trash2, ChevronDown, ChevronRight, Dumbbell } from "lucide-react";
import { useCustomProgramWorkouts, CustomProgramWorkout } from "@/hooks/useCustomPrograms";
import { AddWorkoutSheet } from "@/components/AddWorkoutSheet";
import { AddExerciseSheet } from "@/components/AddExerciseSheet";
import { Exercise, Workout } from "@/types/workout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";

interface StoredExercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipmentId?: string;
}

interface CustomProgramManagerProps {
  programId: string;
  programName: string;
  onSelectWorkout: (workout: Workout) => void;
  onBack: () => void;
}

export function CustomProgramManager({ 
  programId, 
  programName, 
  onSelectWorkout,
  onBack 
}: CustomProgramManagerProps) {
  const { workouts, isLoading, createWorkout, deleteWorkout } = useCustomProgramWorkouts(programId);
  const queryClient = useQueryClient();
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);

  const handleCreateWorkout = async (data: { title: string; dayLabel: string; description: string }) => {
    try {
      await createWorkout.mutateAsync({
        program_id: programId,
        title: data.title,
        day_label: data.dayLabel || undefined,
        description: data.description || undefined,
        exercises: [],
      });
      setIsAddWorkoutOpen(false);
      toast.success(`Created ${data.title}`);
    } catch (error) {
      toast.error("Failed to create workout");
    }
  };

  const handleDeleteWorkout = async (workoutId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this workout?")) {
      try {
        await deleteWorkout.mutateAsync(workoutId);
        toast.success("Workout deleted");
      } catch (error) {
        toast.error("Failed to delete workout");
      }
    }
  };

  const handleAddExercise = async (exercise: Exercise) => {
    if (!editingWorkoutId) return;
    
    const workout = workouts?.find(w => w.id === editingWorkoutId);
    if (!workout) return;

    const currentExercises = (workout.exercises as StoredExercise[]) || [];
    const newExercise: StoredExercise = {
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipmentId: exercise.equipmentId
    };
    const updatedExercises = [...currentExercises, newExercise];

    try {
      const { error } = await supabase
        .from('custom_program_workouts')
        .update({ exercises: JSON.parse(JSON.stringify(updatedExercises)) })
        .eq('id', editingWorkoutId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['custom-program-workouts', programId] });
      toast.success(`Added ${exercise.name}`);
      setEditingWorkoutId(null);
    } catch (error) {
      toast.error("Failed to add exercise");
    }
  };

  const handleRemoveExercise = async (workoutId: string, exerciseIndex: number) => {
    const workout = workouts?.find(w => w.id === workoutId);
    if (!workout) return;

    const currentExercises = (workout.exercises as StoredExercise[]) || [];
    const updatedExercises = currentExercises.filter((_, i) => i !== exerciseIndex);

    try {
      const { error } = await supabase
        .from('custom_program_workouts')
        .update({ exercises: JSON.parse(JSON.stringify(updatedExercises)) })
        .eq('id', workoutId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['custom-program-workouts', programId] });
      toast.success("Exercise removed");
    } catch (error) {
      toast.error("Failed to remove exercise");
    }
  };

  const handleStartWorkout = (customWorkout: CustomProgramWorkout) => {
    const exercises = (customWorkout.exercises as StoredExercise[]) || [];
    const workout: Workout = {
      id: customWorkout.id,
      title: customWorkout.title,
      description: customWorkout.description || '',
      day: customWorkout.day_label || undefined,
      programType: 'custom',
      exercises: exercises.map((ex, idx) => ({
        id: ex.id || `exercise-${idx}`,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        equipmentId: ex.equipmentId
      }))
    };
    onSelectWorkout(workout);
  };

  if (isLoading) {
    return (
      <NeuCard variant="flat" className="p-8 text-center">
        <p className="text-muted-foreground font-mono">Loading workouts...</p>
      </NeuCard>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">{programName}</h2>
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            {workouts?.length || 0} workout{workouts?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NeuButton variant="secondary" onClick={() => setIsAddWorkoutOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Workout
        </NeuButton>
      </div>

      <div className="space-y-4">
        {workouts?.length === 0 ? (
          <NeuCard variant="flat" className="p-8 text-center">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-mono">No workouts yet. Add your first workout!</p>
          </NeuCard>
        ) : (
          workouts?.map((workout) => {
            const exercises = (workout.exercises as StoredExercise[]) || [];
            const isExpanded = expandedWorkout === workout.id;
            
            return (
              <NeuCard 
                key={workout.id} 
                variant={isExpanded ? "pressed" : "raised"}
                className="overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        {workout.day_label && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {workout.day_label}
                          </Badge>
                        )}
                        <h3 className="font-bold">{workout.title}</h3>
                      </div>
                      {workout.description && (
                        <p className="text-xs text-muted-foreground">{workout.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NeuButton 
                      variant="default" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartWorkout(workout);
                      }}
                    >
                      Start
                    </NeuButton>
                    <NeuButton 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleDeleteWorkout(workout.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </NeuButton>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t-2 border-border p-4 space-y-3">
                    {exercises.length === 0 ? (
                      <p className="text-sm text-muted-foreground font-mono text-center py-4">
                        No exercises yet
                      </p>
                    ) : (
                      exercises.map((exercise, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-3 bg-muted/50 border border-border"
                        >
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-xs text-muted-foreground font-mono uppercase">
                              {exercise.muscleGroup}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveExercise(workout.id, idx)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                    <NeuButton
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setEditingWorkoutId(workout.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </NeuButton>
                  </div>
                )}
              </NeuCard>
            );
          })
        )}
      </div>

      <AddWorkoutSheet
        open={isAddWorkoutOpen}
        onOpenChange={setIsAddWorkoutOpen}
        onSubmit={handleCreateWorkout}
      />

      <AddExerciseSheet
        open={!!editingWorkoutId}
        onOpenChange={(open) => !open && setEditingWorkoutId(null)}
        onAddExercise={handleAddExercise}
        existingExerciseIds={
          editingWorkoutId 
            ? ((workouts?.find(w => w.id === editingWorkoutId)?.exercises as StoredExercise[]) || []).map(e => e.id)
            : []
        }
      />
    </section>
  );
}