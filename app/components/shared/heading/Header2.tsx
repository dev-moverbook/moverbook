import React from "react";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

interface Header2Props {
  children: React.ReactNode;
  className?: string; // class for h2
  wrapperClassName?: string; // new: class for outer div
  isCompleted?: boolean;
  button?: React.ReactNode;
  showCheck?: boolean;
}

const Header2: React.FC<Header2Props> = ({
  children,
  className,
  wrapperClassName,
  isCompleted = false,
  button,
  showCheck = true,
}) => {
  return (
    <div
      className={cn(
        "flex justify-between gap-1.5 px-4 md:px-0 border-b border-grayCustom sm:border-none pb-1 md:pb-4",
        wrapperClassName
      )}
    >
      <div className="flex items-center gap-1.5">
        <h2 className={cn("text-xl font-bold", className)}>{children}</h2>
        {showCheck && (
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

export default Header2;
