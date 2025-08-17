import React from "react";
import clsx from "clsx";
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
    <div
      className={clsx("flex items-center justify-between w-full", className)}
    >
      <span className="text-white font-medium">{label}</span>
      <Button
        variant="link"
        type="button"
        onClick={onToggle}
        // className="text-white underline hover:opacity-80 transition"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default TagLabel;
