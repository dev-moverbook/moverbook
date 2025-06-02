import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

interface Header3Props {
  children: React.ReactNode;
  className?: string; // class for h3
  wrapperClassName?: string; // outer div class
  isCompleted?: boolean;
  showCheckmark?: boolean; // ✅ new prop
  button?: React.ReactNode;
}

const Header3: React.FC<Header3Props> = ({
  children,
  className,
  wrapperClassName,
  isCompleted = false,
  showCheckmark = true, // ✅ default to true
  button,
}) => {
  return (
    <div className={cn("flex justify-between gap-1.5", wrapperClassName)}>
      <div className="flex items-center gap-1.5">
        <h3 className={cn("text-2xl font-medium", className)}>{children}</h3>
        {showCheckmark && (
          <CircleCheckBig
            className={cn(
              "w-5 h-5",
              isCompleted ? "text-greenCustom" : "text-grayCustom2"
            )}
          />
        )}
      </div>
      {button}
    </div>
  );
};

export default Header3;
