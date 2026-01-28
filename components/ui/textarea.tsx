import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { error?: string | null }
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Match Input exactly: border, background, and transitions
        "w-full rounded-md border bg-transparent px-2 py-1 transition-colors shadow-sm",
        // Match Input font sizing
        "text-base md:text-sm text-white placeholder:text-grayCustom2",
        // Match Input focus and disabled states
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // The "Secret Sauce" to make it look like an input:
        // 1. block display (like input)
        // 2. h-[34px] matches a py-1 text-sm input
        // 3. resize-none prevents user from messing up the alignment
        "block min-h-[30px] resize-none leading-normal",
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

Textarea.displayName = "Textarea";

export { Textarea };
