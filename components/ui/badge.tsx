"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  active?: boolean;
  interactive?: boolean; // <- set false for read-only tags
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "font-medium text-grayCustom2 border-grayCustom bg-transparent shadow",
        outline: "font-medium text-white bg-transparent border-grayCustom",
        active:
          "font-semibold text-white border-greenCustom shadow hover:bg-greenCustom/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({
  className,
  variant,
  active = false,
  interactive = true,
  onClick,
  ...props
}: BadgeProps) {
  const base = badgeVariants({ variant: active ? "active" : variant });
  const interactiveClasses =
    "cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-0";
  const readOnlyClasses = "cursor-default";

  if (interactive) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick?.(e as any);
        }}
        className={cn(base, interactiveClasses, className)}
        {...props}
      />
    );
  }

  return <div className={cn(base, readOnlyClasses, className)} {...props} />;
}
