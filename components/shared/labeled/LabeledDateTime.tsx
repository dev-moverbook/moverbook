"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/components/shared/FieldDisplay";
import { formatDateTimeLocal } from "@/frontendUtils/helper";

interface LabeledDateTimeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  min?: string;
  max?: string;
  isEditing?: boolean;
}

const LabeledDateTimeInput: React.FC<LabeledDateTimeInputProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  isEditing = true,
}) => {
  const [focused, setFocused] = useState(false);
  const [isIphone, setIsIphone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIphone(/iphone/.test(ua));
    }
  }, []);

  const showGhostText = !value && !focused && isIphone;

  if (!isEditing) {
    return (
      <FieldDisplay
        label={label}
        value={formatDateTimeLocal(value)}
        fallback="—"
      />
    );
  }

  return (
    <div className="relative">
      <Label className="block text-sm font-medium">{label}</Label>

      {showGhostText && (
        <span className="absolute left-3 top-[30px] text-white pointer-events-none text-sm md:hidden">
          Select Date &amp; Time
        </span>
      )}

      <Input
        type="datetime-local"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        min={min}
        max={max}
        className="min-h-[34px] text-white bg-transparent pr-2 cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
      />

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledDateTimeInput;
