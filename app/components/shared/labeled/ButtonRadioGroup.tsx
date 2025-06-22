"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FieldErrorMessage from "./FieldErrorMessage";
import clsx from "clsx";

interface Option {
  label: React.ReactNode;
  value: string;
}

interface ButtonRadioGroupProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string | null;
  name?: string;
  layout?: "vertical" | "horizontal";
  selectedClassName?: string;
  unselectedClassName?: string;
  label?: string;
}

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  options,
  value,
  onChange,
  error,
  name = "option",
  layout = "horizontal",
  selectedClassName = "border-greenCustom text-white font-semibold transition-all duration-200",
  unselectedClassName = "border-grayCustom text-white transition-all duration-200",
  label,
}) => {
  const responsiveLayoutClass =
    layout === "vertical" ? "flex-col" : "flex-col md:flex-row";

  return (
    <div>
      {label && (
        <Label className="text-white text-sm font-medium mb-2 block">
          {label}
        </Label>
      )}

      <RadioGroup
        value={value ?? ""}
        onValueChange={() => {}}
        className={clsx("mb-4 flex gap-3", responsiveLayoutClass)}
      >
        {options.map((option) => (
          <div key={option.value} className="w-full">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="sr-only"
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className={clsx(
                " flex items-center justify-center gap-2 cursor-pointer rounded-full px-6 py-2 text-center border text-sm font-medium w-full hover:bg-background2 transition-all duration-200",
                value === option.value ? selectedClassName : unselectedClassName
              )}
              onClick={() =>
                onChange(value === option.value ? null : option.value)
              }
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default ButtonRadioGroup;
