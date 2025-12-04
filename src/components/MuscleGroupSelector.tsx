import { MuscleGroup, BodyRegion } from "@/types/workout";
import { NeuButton } from "@/components/ui/neu-button";
import { cn } from "@/lib/utils";

interface MuscleGroupSelectorProps {
  muscleGroups: MuscleGroup[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  label: string;
}

const bodyRegionLabels: Record<BodyRegion, string> = {
  "upper-body": "UPPER BODY",
  "lower-body": "LOWER BODY",
  "core": "CORE",
};

const bodyRegionOrder: BodyRegion[] = ["upper-body", "lower-body", "core"];

export function MuscleGroupSelector({
  muscleGroups,
  selectedIds,
  onToggle,
  label,
}: MuscleGroupSelectorProps) {
  // Group by body region
  const grouped = muscleGroups.reduce((acc, mg) => {
    if (!acc[mg.bodyRegion]) {
      acc[mg.bodyRegion] = [];
    }
    acc[mg.bodyRegion].push(mg);
    return acc;
  }, {} as Record<BodyRegion, MuscleGroup[]>);

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {bodyRegionOrder.map((region) => {
        const muscles = grouped[region];
        if (!muscles || muscles.length === 0) return null;

        return (
          <div key={region} className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground">
              {bodyRegionLabels[region]}
            </p>
            <div className="flex flex-wrap gap-2">
              {muscles.map((muscle) => {
                const isSelected = selectedIds.includes(muscle.id);
                return (
                  <button
                    key={muscle.id}
                    type="button"
                    onClick={() => onToggle(muscle.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 border-border transition-all duration-150",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-2xs translate-x-0.5 translate-y-0.5"
                        : "bg-background text-foreground shadow-sm hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5"
                    )}
                  >
                    {muscle.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
