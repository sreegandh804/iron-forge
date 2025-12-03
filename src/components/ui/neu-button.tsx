import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neuButtonVariants = cva(
  "inline-flex items-center justify-center font-bold uppercase tracking-wider border-2 border-border transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-2xs disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5",
        outline: "bg-background text-foreground shadow-sm hover:bg-accent hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5",
        ghost: "border-transparent shadow-none hover:bg-accent hover:border-border",
        program: "bg-background text-foreground shadow-md hover:shadow-lg hover:-translate-x-1 hover:-translate-y-1",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NeuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neuButtonVariants> {}

const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(neuButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NeuButton.displayName = "NeuButton";

export { NeuButton, neuButtonVariants };
