"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FieldDisplay from "./FieldDisplay";
import FieldErrorMessage from "../labeled/FieldErrorMessage";

interface FieldTimeProps {
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

const FieldTime: React.FC<FieldTimeProps> = ({
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
  if (!isEditing) {
    return <FieldDisplay label={label} value={value} fallback={fallback} />;
  }

  return (
    <div className="relative">
      <Label htmlFor={name} className="block text-sm font-medium">
        {label}
      </Label>

      <Input
        id={name}
        type="time"
        value={value ?? ""}
        onChange={onChange}
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

export default FieldTime;
