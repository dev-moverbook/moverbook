"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FieldErrorMessage from "./FieldErrorMessage";
import { cn } from "@/lib/utils";
import FieldDisplay from "../field/FieldDisplay";
import { useId } from "react";

interface Option {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
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
  isEditing?: boolean;
}

const ButtonRadioGroup: React.FC<ButtonRadioGroupProps> = ({
  isEditing = true,
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
  const labelId = useId();
  const responsiveLayoutClass =
    layout === "vertical" ? "flex-col" : "flex-col md:flex-row";

  if (!isEditing) {
    return <FieldDisplay label={label || ""} value={value} fallback="N/A" />;
  }

  return (
    <div>
      {label && (
        <Label className="text-white  font-medium mb-1 block" id={labelId}>
          {label}
        </Label>
      )}

      <RadioGroup
        value={value ?? ""}
        onValueChange={(val) => onChange(val === value ? null : val)}
        className={cn("mb-4 flex gap-3", responsiveLayoutClass)}
        aria-labelledby={label ? `${name}-label` : undefined}
        id={labelId}
      >
        {options.map((option) => (
          <div key={option.value} className="w-full relative">
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              className="absolute left-[-9999px]"
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className={cn(
                "flex items-center justify-center gap-2 cursor-pointer rounded-full px-6 py-2 text-center border text-sm font-medium w-full hover:bg-background2 transition-all duration-200",
                value === option.value ? selectedClassName : unselectedClassName
              )}
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
