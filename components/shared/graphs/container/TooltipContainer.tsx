"use client";

import { cn } from "@/lib/utils";

type TooltipContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export default function TooltipContainer({
  className,
  children,
}: TooltipContainerProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-black p-2 text-sm text-white shadow shadow-white/10",
        className
      )}
      role="tooltip"
    >
      {children}
    </div>
  );
}
