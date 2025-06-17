import React from "react";
import { cn } from "@/lib/utils";

interface ListRowContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ListRowContainer: React.FC<ListRowContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-t border-grayCustom max-w-screen-sm mx-auto mt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ListRowContainer;
