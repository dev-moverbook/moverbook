"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  active?: boolean;
  onClick?: () => void;
}

const badgeVariants = cva(
  // removed `font-medium` from base
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm transition-colors cursor-pointer select-none " +
    "focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        // put weights in variants
        default:
          "font-medium text-grayCustom2 border-grayCustom shadow bg-transparent",
        outline: "font-medium text-white bg-transparent border-grayCustom",
        active:
          "font-semibold text-white  border-greenCustom shadow hover:bg-greenCustom/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  active = false,
  onClick,
  ...props
}: BadgeProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        badgeVariants({ variant: active ? "active" : variant }),
        className // note: if className includes a `font-*`, it will override
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
