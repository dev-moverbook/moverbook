"use client";

import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

interface Header3Props {
  children?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  isCompleted?: boolean;
  showCheckmark?: boolean;
  button?: React.ReactNode;
  hideTitle?: boolean;
  hideButton?: boolean;
}

const Header3: React.FC<Header3Props> = ({
  children,
  className,
  wrapperClassName,
  isCompleted = false,
  showCheckmark = true,
  button,
  hideTitle = false,
  hideButton = false,
}) => {
  return (
    <div
      className={cn(
        "flex items-center w-full pt-6 px-4 md:px-0 max-w-screen-sm mx-auto",
        hideTitle ? "justify-start" : "justify-between",
        wrapperClassName
      )}
    >
      {!hideTitle && (
        <div className="flex items-center gap-1.5">
          <h3 className={cn("text-2xl font-bold", className)}>{children}</h3>
          {showCheckmark && (
            <CircleCheckBig
              className={cn(
                "w-5 h-5",
                isCompleted ? "text-greenCustom" : "text-grayCustom2"
              )}
            />
          )}
        </div>
      )}
      {button && !hideButton && <div className="flex-shrink-0">{button}</div>}
    </div>
  );
};

export default Header3;
