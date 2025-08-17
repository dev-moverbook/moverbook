import React from "react";
import { cn } from "@/lib/utils";

interface ListHeaderProps {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  button?: React.ReactNode;
}

const ListHeader: React.FC<ListHeaderProps> = ({
  children,
  className,
  wrapperClassName,
  button,
}) => {
  return (
    <div
      className={cn(
        "flex justify-between gap-1.5 px-4 md:px-0 border-b border-grayCustom sm:border-none pb-1 md:pb-4",
        wrapperClassName
      )}
    >
      <div className="flex items-center gap-1.5">
        <h3 className={cn("text-lg font-medium", className)}>{children}</h3>
      </div>
      {button}
    </div>
  );
};

export default ListHeader;
