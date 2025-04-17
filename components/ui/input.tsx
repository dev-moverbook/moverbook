import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    const isTimeInput = type === "time";

    return (
      <input
        type={type}
        className={cn(
          "text-white w-full rounded-md border border-grayCustom bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent md:file:text-sm file:font-medium file:text-foreground placeholder:text-grayCustom focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isTimeInput && "pr-[3.5rem] md:min-w-[250px] text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
