import React from "react";
import clsx from "clsx";

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
      className={clsx(
        "flex items-center md:text-sm justify-between w-full",
        className
      )}
    >
      <span className="text-white font-medium">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className="md:text-sm  underline hover:opacity-80 transition"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default TagLabel;
