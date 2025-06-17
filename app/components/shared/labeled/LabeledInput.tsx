import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import { formatPhoneNumber } from "@/app/frontendUtils/helper";

interface LabeledInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  min?: number;
  step?: string;
  isEditing?: boolean;
  isPhoneNumber?: boolean;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder = "",
  error,
  type = "text",
  inputRef,
  min,
  step,
  isEditing = true,
  isPhoneNumber = false,
}) => {
  if (!isEditing) {
    const displayValue = isPhoneNumber
      ? formatPhoneNumber(value)
      : value?.trim();
    return (
      <FieldDisplay label={label || "-"} value={displayValue} fallback="—" />
    );
  }

  return (
    <div>
      {label && <Label className="block text-sm font-medium">{label}</Label>}
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        error={error}
        min={min}
        step={step}
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledInput;
