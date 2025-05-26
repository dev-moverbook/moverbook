"use client";

import React from "react";
import clsx from "clsx";

interface ToggleOption<T extends string> {
  label: string;
  value: T;
}

interface ToggleButtonGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
}

const ToggleButtonGroup = <T extends string>({
  label,
  value,
  onChange,
  options,
}: ToggleButtonGroupProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">{label}</label>
      <div className="flex gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "px-6 py-2 rounded-xl border text-sm font-medium transition-all min-w-[80px]",
              value === option.value
                ? "bg-greenCustom text-black border-greenCustom"
                : "border-greenCustom text-greenCustom bg-transparent"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButtonGroup;
