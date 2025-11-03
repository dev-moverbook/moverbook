"use client";

import { Label } from "@/components/ui/label";
import SelectableCardContainer from "../containers/SelectableCardContainer";
import { CategorySizeLabels } from "@/types/enums";
import { cn } from "@/lib/utils";
import { useId } from "react";

interface SizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
  label?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  value,
  onChange,
  label = "Size",
}) => {
  const labelId = useId();
  return (
    <div>
      <Label className="block font-medium" htmlFor={labelId}>
        {label}
      </Label>
      <div className="flex flex-wrap gap-4 mt-1">
        {Object.entries(CategorySizeLabels).map(([, categorySize]) => {
          const numericSize = parseInt(categorySize.size);
          const isSelected = value === numericSize;

          return (
            <SelectableCardContainer
              id={labelId}
              key={categorySize.label}
              onClick={() => onChange(numericSize)}
              centerText={categorySize.label}
              bottomCenterText={`${categorySize.size}ft³`}
              topLeftText={categorySize.example}
              className={cn(
                "cursor-pointer border",
                isSelected ? "border-greenCustom " : ""
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
