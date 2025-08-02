"use client";

import { Check, AlertTriangle, Truck } from "lucide-react";
import clsx from "clsx";
import React from "react";
import FieldDisplay from "../../shared/FieldDisplay";

interface TruckOption {
  value: number | "custom";
  label: string;
  isRecommended?: boolean;
  isWarning?: boolean;
  isCustom?: boolean;
}

interface TruckSelectorProps {
  value: number | "custom";
  onChange: (value: number | "custom") => void;
  recommendedValue?: number;
  warningValue?: number;
  max?: number;
  isEditing?: boolean;
}

const TruckSelector: React.FC<TruckSelectorProps> = ({
  value,
  onChange,
  recommendedValue,
  warningValue,
  max = 3,
  isEditing = true,
}) => {
  const options: TruckOption[] = [];

  for (let i = 0; i <= max; i++) {
    options.push({
      value: i,
      label: i.toString(),
      isRecommended: i === recommendedValue,
      isWarning: i === warningValue,
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-4">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={clsx(
                "w-16 h-[5.5rem] border rounded-xl flex flex-col items-center   text-white transition relative",
                isSelected
                  ? "border-greenCustom"
                  : "border-grayCustom hover:bg-white/10"
              )}
              type="button"
            >
              <div className="text-lg font-semibold pt-1">
                {typeof option.value === "number" ? option.value : ""}
              </div>
              <div>
                <Truck className="w-6 h-6" />
              </div>

              {/* Icons */}
              {option.isRecommended && (
                <Check className="text-green-500 w-4 h-4 absolute bottom-1" />
              )}
              {option.isWarning && !option.isRecommended && (
                <AlertTriangle className="text-yellow-400 w-4 h-4 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TruckSelector;
