import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  iconClassName?: string;
  variant?: "default" | "outline" | "green" | "ghost";
};

const IconButton = ({
  icon,
  iconClassName,
  className,
  variant = "default",
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "p-1.5 rounded-full transition",
        variant === "default" &&
          "bg-transparent hover:bg-gray-800 border border-greenCustom",
        variant === "outline" &&
          "bg-transparent border border-gray-600 hover:bg-gray-700",
        variant === "green" && "bg-greenCustom",
        variant === "ghost" &&
          "bg-transparent hover:bg-white/10 text-white border-none",
        className
      )}
    >
      <span className={cn(iconClassName)}>{icon}</span>
    </button>
  );
};

export default IconButton;
