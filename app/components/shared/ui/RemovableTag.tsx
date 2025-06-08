import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemovableTagProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

const RemovableTag: React.FC<RemovableTagProps> = ({
  label,
  onRemove,
  className,
}) => {
  return (
    <span
      className={cn(
        "shadow-lg shadow-white/10 transition inline-flex items-center text-sm pl-3 pr-1 py-1 rounded border border-grayCustom",
        className
      )}
    >
      {label}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 p-1 text-muted-foreground hover:bg-gray-800 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};

export default RemovableTag;
