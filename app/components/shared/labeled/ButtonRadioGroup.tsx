import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FieldErrorMessage from "./FieldErrorMessage";
import clsx from "clsx";

interface Option {
  label: string;
  value: string;
}

interface ButtonRadioGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
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
  selectedClassName = "border-green-500 text-white font-semibold",
  unselectedClassName = "border-gray-500 text-gray-400",
  label,
}) => {
  return (
    <div>
      {label && (
        <Label className="text-white text-sm font-medium">{label}</Label>
      )}

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={clsx("mb-4 flex gap-3 flex-col md:flex-row")}
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
                "block cursor-pointer rounded-full px-6 py-2 text-center border text-sm font-medium transition-all w-full hover:bg-gray-900",
                value === option.value ? selectedClassName : unselectedClassName
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
        <FieldErrorMessage error={error} />
      </RadioGroup>
    </div>
  );
};

export default ButtonRadioGroup;
