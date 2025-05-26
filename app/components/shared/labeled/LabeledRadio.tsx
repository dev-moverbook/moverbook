"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldErrorMessage from "./FieldErrorMessage";

interface RadioOption {
  label: string;
  value: string;
}

interface LabeledRadioProps {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
}

const LabeledRadio: React.FC<LabeledRadioProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  disabled = false,
  error,
}) => {
  return (
    <div>
      <Label className="block text-sm font-medium text-white ">{label}</Label>
      <RadioGroup
        name={name}
        value={value}
        onValueChange={onChange}
        className="flex flex-col gap-1"
        disabled={disabled}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="w-4 h-4 rounded-full border border-white  data-[state=checked]:bg-greenCustom 
    data-[state=checked]:border-greenCustom"
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm pt-1 text-white"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledRadio;
