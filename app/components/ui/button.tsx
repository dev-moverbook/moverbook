import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md md:text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-greenCustom text-white rounded-[20px] shadow shadow-greenCustom/10 hover:bg-greenCustom/90 font-semibold focus-visible:ring-1 focus-visible:ring-white",
        destructive:
          "bg-destructive border border-destructive rounded-[20px] text-white shadow shadow-destructive/10 hover:bg-destructive/80",
        outline:
          "rounded-[20px] border border-greenCustom bg-transparent text-greenCustom shadow-sm hover:shadow-[0_0_0_2px_rgba(34,197,94,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "text-greenCustom font-bold hover:underline font-semibold rounded-[20px]",
        whiteGhost:
          "text-white font-bold hover:underline font-semibold rounded-[20px]",
        link: "text-sm underline font-normal  hover:opacity-80 ",
        plain: "",
        sidebar:
          "w-full hover:bg-gray-700 rounded-md p-1 transition justify-start gap-4",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[20px] px-3 text-sm",
        lg: "h-10 rounded-md px-8",
        icon: "h-6 w-6",
        auto: "p-0 h-auto w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, className }),
            "relative",
            (isLoading || disabled) && "pointer-events-none opacity-50"
          )}
          ref={ref}
          {...props} // ← no `disabled` here
        >
          {children}
        </Slot>
      );
    } else {
      // Standard button with loading spinner
      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            "relative"
          )}
          ref={ref}
          disabled={isLoading || disabled}
          {...props}
        >
          <span className={cn(isLoading && "invisible")}>{children}</span>
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          )}
        </button>
      );
    }
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
