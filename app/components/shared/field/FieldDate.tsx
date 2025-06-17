import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FieldDisplay from "../FieldDisplay";
import FieldErrorMessage from "../labeled/FieldErrorMessage";

interface FieldDateProps {
  label: string;
  name: string;
  value?: string | null;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  fallback?: string;
  min?: string;
  max?: string;
}

const FieldDate: React.FC<FieldDateProps> = ({
  label,
  name,
  value,
  isEditing = true,
  onChange,
  error,
  fallback = "N/A",
  min,
  max,
}) => {
  const [focused, setFocused] = useState(false);

  if (!isEditing) {
    return (
      <FieldDisplay
        label={label}
        value={value ? new Date(value).toLocaleDateString() : undefined}
        fallback={fallback}
      />
    );
  }

  return (
    <div className="relative">
      <Label htmlFor={name} className="block text-sm font-medium">
        {label}
      </Label>

      {/* {!value && !focused && (
        <span className="absolute left-3 top-[30px] text-white pointer-events-none text-sm md:hidden">
          Select Date
        </span>
      )} */}

      <Input
        id={name}
        type="date"
        value={value ?? ""}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        min={min}
        max={max}
        className={cn(
          "min-h-[34px] text-white bg-transparent pr-2 cursor-pointer [&::-webkit-calendar-picker-indicator]:invert",
          error && "border-red-500"
        )}
      />

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default FieldDate;
