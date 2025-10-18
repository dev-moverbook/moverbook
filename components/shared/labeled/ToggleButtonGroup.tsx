"use client";

import React from "react";
import clsx from "clsx";
import FieldDisplay from "@/components/shared/field/FieldDisplay";

interface ToggleOption<T extends string> {
  label: string;
  value: T;
}

interface ToggleButtonGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
  isEditing?: boolean;
}

const ToggleButtonGroup = <T extends string>({
  label,
  value,
  onChange,
  options,
  isEditing = true,
}: ToggleButtonGroupProps<T>) => {
  const selected = options.find((opt) => opt.value === value);

  if (!isEditing) {
    return (
      <FieldDisplay label={label} value={selected?.label || "—"} fallback="—" />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white  font-medium">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "px-6 text-sm py-2 rounded-xl border  font-medium transition-all min-w-[80px] hover:bg-white/10",
              value === option.value
                ? "bg-greenCustom  border-greenCustom "
                : "border-grayCustom bg-transparent"
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
