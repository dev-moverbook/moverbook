import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemovableTagProps {
  label: React.ReactNode;
  onRemove: () => void;
  className?: string;
  dotColor?: string; // optional
}

const RemovableTag: React.FC<RemovableTagProps> = ({
  label,
  onRemove,
  className,
  dotColor,
}) => {
  return (
    <span
      className={cn(
        "shadow-lg shadow-white/10 transition inline-flex items-center text-xs pl-2 py-0.5 rounded border border-grayCustom",
        className
      )}
    >
      {dotColor && (
        <span
          className="w-1.5 h-1.5 rounded-full mr-1"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {label}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 p-1 text-muted-foreground hover:bg-background2 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};

export default RemovableTag;
