import React from "react";
import { cn } from "@/lib/utils";

interface InlineBannerProps {
  message: string;
  show: boolean;
  className?: string;
}

const InlineBanner: React.FC<InlineBannerProps> = ({
  message,
  show,
  className,
}) => {
  return (
    <div className={cn("h-5 pl-4 pt-2", className)}>
      <p
        className={cn(
          "text-greenCustom text-sm transition-opacity duration-300",
          show ? "opacity-100" : "opacity-0"
        )}
      >
        {message}
      </p>
    </div>
  );
};

export default InlineBanner;
