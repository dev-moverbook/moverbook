import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

interface Header3Props {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  isCompleted?: boolean;
  showCheckmark?: boolean;
  button?: React.ReactNode;
}

const Header3: React.FC<Header3Props> = ({
  children,
  className,
  wrapperClassName,
  isCompleted = false,
  showCheckmark = true,
  button,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full pt-6 px-4 md:px-0 max-w-screen-sm mx-auto",
        wrapperClassName
      )}
    >
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
      {button && <div className="flex-shrink-0">{button}</div>}
    </div>
  );
};

export default Header3;
