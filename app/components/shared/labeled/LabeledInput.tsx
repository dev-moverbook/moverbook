import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";

interface LabeledInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // ← add this
  placeholder?: string;
  error?: string | null;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  min?: number;
  step?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  onBlur, // ← receive it
  placeholder = "",
  error,
  type = "text",
  inputRef,
  min,
  step,
}) => {
  return (
    <div>
      <Label className="block text-sm font-medium">{label}</Label>
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur} // ← use it
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
