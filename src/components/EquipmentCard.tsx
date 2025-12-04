import { useState } from "react";
import { Equipment } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Dumbbell, Cog, Zap, Cable, User, ChevronDown, Lock } from "lucide-react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ExerciseForm } from "@/components/ExerciseForm";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  equipment: Equipment;
  onRemove: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

const categoryIcons = {
  machine: Cog,
  "free-weight": Dumbbell,
  cardio: Zap,
  cable: Cable,
  bodyweight: User,
};

export function EquipmentCard({ equipment, onRemove, onToggleAvailability }: EquipmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  const Icon = categoryIcons[equipment.category];
  const exerciseCount = equipment.exercises?.length || 0;
  const isAvailable = equipment.isAvailable ?? true;
  const isDefault = equipment.isDefault ?? false;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <NeuCard 
        variant={isOpen ? "pressed" : "raised"} 
        className={cn(
          "p-0 overflow-hidden transition-opacity",
          !isAvailable && "opacity-50"
        )}
      >
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{equipment.name}</p>
                  {isDefault && (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono uppercase">
                  {equipment.category} • {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(equipment.id);
                  }}
                  className="p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t-2 border-border p-4 space-y-4">
            {/* Availability Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <span className="text-sm font-medium">Available in my gym</span>
              <Switch
                checked={isAvailable}
                onCheckedChange={(checked) => onToggleAvailability(equipment.id, checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Exercises ({exerciseCount})
              </p>
              {!isAddingExercise && (
                <NeuButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingExercise(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </NeuButton>
              )}
            </div>

            {isAddingExercise && (
              <ExerciseForm
                equipmentId={equipment.id}
                onCancel={() => setIsAddingExercise(false)}
                onSuccess={() => setIsAddingExercise(false)}
              />
            )}

            {equipment.exercises && equipment.exercises.length > 0 ? (
              <div className="space-y-2">
                {equipment.exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            ) : (
              !isAddingExercise && (
                <p className="text-sm text-muted-foreground font-mono text-center py-4">
                  No exercises added yet
                </p>
              )
            )}
          </div>
        </CollapsibleContent>
      </NeuCard>
    </Collapsible>
  );
}
