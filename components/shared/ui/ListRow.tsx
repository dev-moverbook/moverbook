import React from "react";
import { cn } from "@/lib/utils";

interface ListRowProps {
  left: string;
  right?: string;
  bold?: boolean;
  className?: string;
}

const ListRow: React.FC<ListRowProps> = ({ left, right, bold, className }) => {
  return (
    <div
      className={cn(
        "flex justify-between items-start py-3 border-b px-5  border-grayCustom",
        className
      )}
    >
      <p className={cn("text-sm", bold && "font-semibold text-white")}>
        {left}
      </p>
      {right && (
        <p
          className={cn(
            "text-sm text-right",
            bold && "font-semibold text-white"
          )}
        >
          {right}
        </p>
      )}
    </div>
  );
};

export default ListRow;
