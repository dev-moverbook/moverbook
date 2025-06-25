import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  iconClassName?: string;
  variant?: "default" | "outline" | "green" | "ghost";
  loading?: boolean;
};

import { Loader2 } from "lucide-react"; // spinner icon

const IconButton = ({
  icon,
  iconClassName,
  className,
  variant = "default",
  loading = false,
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "flex items-center justify-center p-1.5 rounded-full transition",
        variant === "default" &&
          "bg-transparent hover:bg-background2 border border-greenCustom",
        variant === "outline" &&
          "bg-transparent border border-gray-600 hover:bg-gray-700",
        variant === "green" &&
          "bg-greenCustom hover:bg-greenCustom/80 disabled:opacity-70",
        variant === "ghost" &&
          "bg-transparent hover:bg-white/10 text-white border-none",
        className
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin w-4 h-4 text-white" />
      ) : (
        <span className={cn(iconClassName)}>{icon}</span>
      )}
    </button>
  );
};

export default IconButton;
