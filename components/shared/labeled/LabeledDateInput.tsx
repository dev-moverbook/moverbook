"use client";

import { useState, useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import { formatDateToLong } from "@/frontendUtils/helper";
import { useIsIphone } from "@/hooks/utils/useIsIphone";

interface LabeledDateInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  min?: string;
  max?: string;
  isEditing?: boolean;
}

const LabeledDateInput: React.FC<LabeledDateInputProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  isEditing = true,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const isIphone = useIsIphone();
  const inputId = useId();

  const showGhostText = !value && !focused && isIphone;

  if (!isEditing) {
    return (
      <FieldDisplay
        label={label}
        value={formatDateToLong(value)}
        fallback="—"
      />
    );
  }

  return (
    <div className="relative w-full">
      <Label className="block font-medium" htmlFor={inputId}>
        {label}
      </Label>

      {showGhostText && (
        <span className="absolute left-3 top-[30px] text-white pointer-events-none text-sm md:hidden">
          Select Date
        </span>
      )}

      <Input
        id={inputId}
        type="date"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        min={min}
        max={max}
        className=" w-[300px] h-[40px] md:h-full text-white bg-transparent pr-2 cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
      />

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledDateInput;
