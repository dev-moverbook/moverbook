// components/ui/BadgeButton.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "text-white bg-background2 border-grayCustom shadow hover:bg-background2/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-white bg-transparent border-grayCustom",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof badgeVariants> {}

export const BadgeButton = React.forwardRef<
  HTMLButtonElement,
  BadgeButtonProps
>(({ className, variant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(badgeVariants({ variant }), className, "cursor-pointer")}
      {...props}
    />
  );
});

BadgeButton.displayName = "BadgeButton";
