import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import { formatCurrency, formatPhoneNumber } from "@/app/frontendUtils/helper";

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
  valueClassName?: string; // NEW
  isCurrency?: boolean;
  name?: string;
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
  valueClassName = "md:text-sm text-grayCustom2",
  isCurrency = false,
  name,
}) => {
  if (!isEditing) {
    const displayValue = isPhoneNumber
      ? formatPhoneNumber(value)
      : isCurrency
        ? formatCurrency(Number(value))
        : value?.trim();
    return (
      <FieldDisplay
        label={label || ""}
        value={displayValue}
        fallback="—"
        valueClassName={valueClassName}
      />
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
        name={name}
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledInput;
