"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/components/shared/field/FieldDisplay";

interface CheckboxOption {
  label: string;
  value: string;
}

interface LabeledCheckboxGroupProps {
  label: string;
  name: string;
  values: string[];
  options: CheckboxOption[];
  onChange: (newValues: string[]) => void;
  disabled?: boolean;
  error?: string | null;
  isEditing?: boolean;
}

const LabeledCheckboxGroup: React.FC<LabeledCheckboxGroupProps> = ({
  label,
  name,
  values,
  options,
  onChange,
  disabled = false,
  error,
  isEditing = true,
}) => {
  if (!isEditing) {
    const selectedLabels = options
      .filter((opt) => values.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ");

    return (
      <FieldDisplay
        label={label}
        value={selectedLabels || undefined}
        fallback="—"
      />
    );
  }

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div>
      <Label className="block  font-medium text-white">{label}</Label>
      <div className="flex flex-col gap-1 mt-1">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${name}-${option.value}`}
              checked={values.includes(option.value)}
              onCheckedChange={() => toggleValue(option.value)}
              disabled={disabled}
              className="border-grayCustom data-[state=checked]:bg-greenCustom data-[state=checked]:border-greenCustom"
            />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm pt-1 text-white"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledCheckboxGroup;
