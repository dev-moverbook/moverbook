"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";

interface LabeledTimeInputProps {
  label: string;
  value: string; // Format: "HH:mm"
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  min?: string; // Optional min time, e.g. "08:00"
  max?: string; // Optional max time, e.g. "18:00"
}

const LabeledTimeInput: React.FC<LabeledTimeInputProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="block text-sm font-medium">{label}</Label>
      <Input
        type="time"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledTimeInput;
