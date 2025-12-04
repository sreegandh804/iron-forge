import { useState } from "react";
import { Equipment } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Plus, Dumbbell, Cog, Zap, Cable, User } from "lucide-react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { useEquipment } from "@/hooks/useEquipment";
import { useToast } from "@/hooks/use-toast";

const categoryIcons = {
  machine: Cog,
  "free-weight": Dumbbell,
  cardio: Zap,
  cable: Cable,
  bodyweight: User,
};

const categories: Equipment["category"][] = [
  "machine",
  "free-weight",
  "cardio",
  "cable",
  "bodyweight",
];

export function EquipmentManager() {
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Equipment["category"]>("machine");
  const [isAdding, setIsAdding] = useState(false);

  const { equipment, isLoading, addEquipment, removeEquipment, toggleAvailability } = useEquipment();
  const { toast } = useToast();

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await toggleAvailability.mutateAsync({ id, isAvailable });
      toast({
        title: isAvailable ? "Marked as available" : "Marked as unavailable",
        description: `Equipment ${isAvailable ? "is now" : "is no longer"} in your gym`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    if (newName.trim()) {
      try {
        await addEquipment.mutateAsync({
          name: newName.trim(),
          category: newCategory,
        });
        toast({
          title: "Success",
          description: "Equipment added",
        });
        setNewName("");
        setIsAdding(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add equipment",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemove = async (id: string) => {
    const item = equipment.find(e => e.id === id);
    if (item?.isDefault) {
      toast({
        title: "Cannot delete",
        description: "Default equipment cannot be removed. Toggle availability instead.",
        variant: "destructive",
      });
      return;
    }
    try {
      await removeEquipment.mutateAsync(id);
      toast({
        title: "Deleted",
        description: "Equipment removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove equipment",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight">
            Your Equipment
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            Log machines available at your gym
          </p>
        </div>
        <NeuButton
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </NeuButton>
      </div>

      {isAdding && (
        <NeuCard variant="flat" className="border-dashed">
          <div className="space-y-4">
            <Input
              placeholder="Equipment name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-2 border-border bg-background h-12 font-mono"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat];
                return (
                  <NeuButton
                    key={cat}
                    variant={newCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewCategory(cat)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {cat}
                  </NeuButton>
                );
              })}
            </div>
            <div className="flex gap-2">
              <NeuButton
                onClick={handleAdd}
                size="sm"
                disabled={addEquipment.isPending}
              >
                {addEquipment.isPending ? "Saving..." : "Save"}
              </NeuButton>
              <NeuButton
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </NeuButton>
            </div>
          </div>
        </NeuCard>
      )}

      {isLoading ? (
        <NeuCard variant="flat" className="text-center py-12">
          <p className="text-muted-foreground font-mono">Loading equipment...</p>
        </NeuCard>
      ) : (
        <div className="grid gap-3">
          {equipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onRemove={handleRemove}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </div>
      )}

      {!isLoading && equipment.length === 0 && !isAdding && (
        <NeuCard variant="flat" className="border-dashed text-center py-12">
          <p className="text-muted-foreground font-mono">
            No equipment added yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add" to log your gym's equipment
          </p>
        </NeuCard>
      )}
    </section>
  );
}
