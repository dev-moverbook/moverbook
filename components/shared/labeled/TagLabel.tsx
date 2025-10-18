"use client";

import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

interface TagLabelProps {
  label: string;
  buttonText: string;
  onToggle?: () => void;
  className?: string;
}

const TagLabel: React.FC<TagLabelProps> = ({
  label,
  buttonText,
  onToggle,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      <span className="text-white font-medium">{label}</span>
      <Button variant="link" type="button" onClick={onToggle}>
        {buttonText}
      </Button>
    </div>
  );
};

export default TagLabel;
