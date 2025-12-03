import { useState } from "react";
import { Equipment } from "@/types/workout";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Plus, X, Dumbbell, Cog, Zap, Cable, User } from "lucide-react";

interface EquipmentManagerProps {
  equipment: Equipment[];
  onAddEquipment: (equipment: Equipment) => void;
  onRemoveEquipment: (id: string) => void;
}

const categoryIcons = {
  'machine': Cog,
  'free-weight': Dumbbell,
  'cardio': Zap,
  'cable': Cable,
  'bodyweight': User,
};

const categories: Equipment['category'][] = ['machine', 'free-weight', 'cardio', 'cable', 'bodyweight'];

export function EquipmentManager({ equipment, onAddEquipment, onRemoveEquipment }: EquipmentManagerProps) {
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Equipment['category']>("machine");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newName.trim()) {
      onAddEquipment({
        id: Date.now().toString(),
        name: newName.trim(),
        category: newCategory,
      });
      setNewName("");
      setIsAdding(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Your Equipment</h2>
          <p className="text-muted-foreground font-mono text-sm">Log machines available at your gym</p>
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
              <NeuButton onClick={handleAdd} size="sm">Save</NeuButton>
              <NeuButton variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</NeuButton>
            </div>
          </div>
        </NeuCard>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {equipment.map((item) => {
          const Icon = categoryIcons[item.category];
          return (
            <NeuCard key={item.id} variant="raised" className="p-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono uppercase">{item.category}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveEquipment(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </NeuCard>
          );
        })}
      </div>

      {equipment.length === 0 && !isAdding && (
        <NeuCard variant="flat" className="border-dashed text-center py-12">
          <p className="text-muted-foreground font-mono">No equipment added yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add" to log your gym's equipment</p>
        </NeuCard>
      )}
    </section>
  );
}
