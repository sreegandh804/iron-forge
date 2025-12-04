import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MuscleGroupBadgeProps {
  name: string;
  type: "primary" | "secondary";
  className?: string;
}

export function MuscleGroupBadge({ name, type, className }: MuscleGroupBadgeProps) {
  return (
    <Badge
      variant={type === "primary" ? "default" : "outline"}
      className={cn(
        "text-xs font-mono uppercase",
        type === "secondary" && "border-2",
        className
      )}
    >
      {name}
    </Badge>
  );
}
