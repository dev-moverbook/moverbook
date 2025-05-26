import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";

interface LabeledDateInputProps {
  label: string;
  value: string; // should be in YYYY-MM-DD format
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  min?: string;
  max?: string;
}

const LabeledDateInput: React.FC<LabeledDateInputProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
}) => {
  return (
    <div>
      <Label className="block text-sm font-medium">{label}</Label>
      <Input
        type="date"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="cursor-pointer text-white bg-transparent pr-2 [&::-webkit-calendar-picker-indicator]:invert"
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledDateInput;
