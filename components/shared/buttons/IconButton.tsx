"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  iconClassName?: string;
  variant?: "default" | "outline" | "green" | "ghost";
  loading?: boolean;
  asChild?: boolean;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      iconClassName,
      className,
      variant = "default",
      loading = false,
      asChild = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full p-1.5 transition-colors duration-150",
          variant === "default" &&
            "bg-transparent hover:bg-background2 border border-greenCustom",
          variant === "outline" &&
            "bg-transparent border border-gray-600 hover:bg-gray-700",
          variant === "green" &&
            "bg-greenCustom text-white hover:bg-greenCustom/80",
          variant === "ghost" &&
            "bg-transparent text-white hover:bg-white/10 border-none outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-greenCustom",
          isDisabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className
        )}
        disabled={asChild ? undefined : isDisabled}
        {...props}
      >
        {asChild ? (
          children
        ) : loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <span className={cn(iconClassName)}>{icon}</span>
        )}
      </Comp>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
