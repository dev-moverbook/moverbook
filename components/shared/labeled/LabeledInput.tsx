import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/components/shared/FieldDisplay";
import { formatCurrency, formatPhoneNumber } from "@/frontendUtils/helper";

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
  valueClassName?: string;
  isCurrency?: boolean;
  name?: string;
  noPlaceholderError?: boolean;
  className?: string;
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
  valueClassName = "text-grayCustom2",
  isCurrency = false,
  name,
  noPlaceholderError = false,
  className,
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
    <div className={className}>
      {label && <Label className="block font-medium">{label}</Label>}
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
      <FieldErrorMessage noPlaceholder={noPlaceholderError} error={error} />
    </div>
  );
};

export default LabeledInput;
