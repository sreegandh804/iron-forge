import { useState } from 'react';
import { Exercise } from '@/types/workout';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { NeuButton } from '@/components/ui/neu-button';
import { NeuCard } from '@/components/ui/neu-card';
import { MuscleGroupBadge } from '@/components/MuscleGroupBadge';
import { Search, Plus, Dumbbell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AddExerciseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExercise: (exercise: Exercise) => void;
  existingExerciseIds: string[];
}

export function AddExerciseSheet({ 
  open, 
  onOpenChange, 
  onAddExercise,
  existingExerciseIds 
}: AddExerciseSheetProps) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  // Fetch custom exercises with their muscle targets
  const { data: customExercises = [] } = useQuery({
    queryKey: ['custom-exercises-with-muscles'],
    queryFn: async () => {
      const { data: exercises, error: exError } = await supabase
        .from('custom_exercises')
        .select(`
          id,
          name,
          equipment_id,
          equipment!inner(name, is_available)
        `);

      if (exError) throw exError;

      const { data: targets, error: tError } = await supabase
        .from('exercise_muscle_targets')
        .select(`
          exercise_id,
          target_type,
          muscle_groups!inner(name)
        `);

      if (tError) throw tError;

      // Map exercises with their primary muscle
      return exercises?.map(ex => {
        const primaryTarget = targets?.find(
          t => t.exercise_id === ex.id && t.target_type === 'primary'
        );
        return {
          id: ex.id,
          name: ex.name,
          equipmentId: ex.equipment_id,
          equipmentName: (ex.equipment as any)?.name || 'Unknown',
          isAvailable: (ex.equipment as any)?.is_available ?? true,
          muscleGroup: (primaryTarget?.muscle_groups as any)?.name || 'Unknown',
        };
      }) || [];
    },
  });

  // Filter exercises
  const filteredExercises = customExercises.filter(ex => {
    // Exclude already added exercises
    if (existingExerciseIds.includes(ex.id)) return false;
    
    // Only show available equipment exercises
    if (!ex.isAvailable) return false;
    
    // Search filter
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    
    // Muscle filter
    if (selectedMuscle && ex.muscleGroup !== selectedMuscle) return false;
    
    return true;
  });

  // Get unique muscle groups for filtering
  const muscleGroups = [...new Set(customExercises.map(ex => ex.muscleGroup))].filter(Boolean);

  const handleAdd = (exercise: typeof customExercises[0]) => {
    const newExercise: Exercise = {
      id: exercise.id,
      name: exercise.name,
      equipmentId: exercise.equipmentId,
      muscleGroup: exercise.muscleGroup,
    };
    onAddExercise(newExercise);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg border-l-4 border-border">
        <SheetHeader>
          <SheetTitle className="font-bold uppercase tracking-wide">Add Exercise</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-2 border-border"
            />
          </div>

          {/* Muscle Filter */}
          <div className="flex flex-wrap gap-2">
            <NeuButton
              variant={selectedMuscle === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMuscle(null)}
            >
              All
            </NeuButton>
            {muscleGroups.map(muscle => (
              <NeuButton
                key={muscle}
                variant={selectedMuscle === muscle ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMuscle(muscle)}
              >
                {muscle}
              </NeuButton>
            ))}
          </div>

          {/* Exercise List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No exercises found</p>
                <p className="text-xs">Try adjusting your filters</p>
              </div>
            ) : (
              filteredExercises.map(exercise => (
                <NeuCard key={exercise.id} variant="flat" className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{exercise.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <MuscleGroupBadge name={exercise.muscleGroup} type="secondary" />
                        <span className="text-xs text-muted-foreground font-mono truncate">
                          {exercise.equipmentName}
                        </span>
                      </div>
                    </div>
                    <NeuButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAdd(exercise)}
                    >
                      <Plus className="h-4 w-4" />
                    </NeuButton>
                  </div>
                </NeuCard>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
