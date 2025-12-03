import * as React from "react";
import { cn } from "@/lib/utils";

interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "raised" | "pressed" | "flat";
}

const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ className, variant = "raised", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-secondary border-2 border-border p-6 transition-all duration-200",
          variant === "raised" && "shadow-md hover:shadow-lg hover:-translate-x-0.5 hover:-translate-y-0.5",
          variant === "pressed" && "shadow-2xs translate-x-0.5 translate-y-0.5",
          variant === "flat" && "shadow-none",
          className
        )}
        {...props}
      />
    );
  }
);
NeuCard.displayName = "NeuCard";

export { NeuCard };
