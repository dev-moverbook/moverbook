import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  iconClassName?: string;
  variant?: "default" | "outline" | "green" | "ghost";
  loading?: boolean;
  asChild?: boolean;
  disabled?: boolean;
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
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        {...props}
        ref={ref}
        className={cn(
          "flex items-center justify-center p-1.5 rounded-full transition",
          variant === "default" &&
            "bg-transparent hover:bg-background2 border border-greenCustom",
          variant === "outline" &&
            "bg-transparent border border-gray-600 hover:bg-gray-700",
          variant === "green" && "bg-greenCustom hover:bg-greenCustom/80",
          variant === "ghost" &&
            "bg-transparent hover:bg-white/10 text-white border-none outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-greenCustom",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...(!asChild && { disabled })}
      >
        {loading ? (
          <Loader2 className="animate-spin w-4 h-4 text-white" />
        ) : (
          <span className={cn(iconClassName)}>{icon}</span>
        )}
      </Comp>
    );
  }
);

IconButton.displayName = "IconButton";
export default IconButton;
