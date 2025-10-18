"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
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
  isEditing?: boolean;
}

const LabeledRadio: React.FC<LabeledRadioProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  disabled = false,
  error,
  isEditing = true,
}) => {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  if (!isEditing) {
    return <FieldDisplay label={label} value={selectedLabel} fallback="—" />;
  }

  return (
    <div>
      <Label className="block text-sm font-medium text-white">{label}</Label>
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
              className="hover:bg-greenCustom80 hover:border-none w-4 h-4 rounded-full border border-grayCustom data-[state=checked]:bg-greenCustom data-[state=checked]:border-greenCustom"
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm pt-1 text-white cursor-pointer"
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
