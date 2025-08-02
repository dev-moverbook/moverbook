"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldErrorMessage from "./FieldErrorMessage";

export interface SelectOption {
  label: string;
  value: string;
}

interface LabeledSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string | null;
  loading?: boolean;
  queryError?: string | null;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  queryError,
  loading = false,
}) => {
  const isLabeled = label !== "";
  return (
    <div>
      {isLabeled && (
        <Label className="block text-sm font-medium">{label}</Label>
      )}
      <Select
        value={value ?? undefined}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {loading ? (
            <SelectItem disabled value="loading">
              Loading...
            </SelectItem>
          ) : options.length > 0 ? (
            options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value="no-options">
              No options available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <FieldErrorMessage error={error || queryError} />
    </div>
  );
};

export default LabeledSelect;
