"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/components/ui/label";
import { CategorySize } from "@/types/convex-enums";
import SelectableCardContainer from "../containers/SelectableCardContainer";
import { CategorySizeLabels } from "@/types/enums";

interface SizeSelectorProps {
  value: CategorySize | number;
  onChange: (size: CategorySize) => void;
  label?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  value,
  onChange,
  label = "Size",
}) => {
  const handleCardClick = () => {
    onChange(value as CategorySize);
  };

  return (
    <div>
      <Label className="block text-sm font-medium">{label}</Label>
      <div className="flex flex-wrap gap-4 mt-1">
        {Object.values(CategorySizeLabels).map((categorySize) => (
          <SelectableCardContainer
            onClick={handleCardClick}
            key={categorySize.label}
            centerText={categorySize.label}
            bottomCenterText={categorySize.size}
          ></SelectableCardContainer>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
