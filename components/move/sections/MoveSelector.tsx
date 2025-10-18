"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoverOption {
  value: number;
  label: string;
  isRecommended?: boolean;
  isWarning?: boolean;
  hourRange?: string;
}

interface MoverSelectorProps {
  value: number;
  onChange: (value: number) => void;
  recommendedValue?: number;
  warningValue?: number;
  hourEstimates: Record<number, [number, number]>;
}

const MoverSelector: React.FC<MoverSelectorProps> = ({
  value,
  onChange,
  recommendedValue,
  warningValue,
  hourEstimates,
}) => {
  const sortedKeys = Object.keys(hourEstimates)
    .map(Number)
    .sort((a, b) => a - b);

  const options: MoverOption[] = sortedKeys.map((i) => ({
    value: i,
    label: i.toString(),
    isRecommended: i === recommendedValue,
    isWarning: i === warningValue,
    hourRange: `(${hourEstimates[i][0]}–${hourEstimates[i][1]} hrs)`,
  }));

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-4">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
              className={cn(
                "w-16 h-[5.5rem] border rounded-xl flex flex-col items-center text-white transition relative py-1",
                isSelected
                  ? "border-greenCustom"
                  : "border-grayCustom hover:bg-white/10"
              )}
            >
              <div className="text-lg font-semibold">{option.label}</div>
              <User className="w-6 h-6" />
              <div className="text-xs pt-1">{option.hourRange}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoverSelector;
