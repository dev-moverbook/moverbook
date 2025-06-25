import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { error?: string | null }
>(({ className, type = "text", error, ...props }, ref) => {
  const isTimeInput = type === "time";

  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-md border bg-transparent px-2 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent md:file:text-sm file:font-medium file:text-foreground placeholder:text-grayCustom2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white",
        isTimeInput && "md:min-w-[150px] text-base",
        error
          ? "border-red-500 focus-visible:ring-red-500"
          : "border-grayCustom",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
