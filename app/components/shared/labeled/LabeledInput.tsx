import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
interface LabeledInputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement>; // ← add this
  min?: number;
  step?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
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
        ref={inputRef} // ← use it here
        type={type}
        value={value}
        onChange={onChange}
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
