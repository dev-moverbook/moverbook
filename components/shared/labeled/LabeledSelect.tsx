"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldErrorMessage from "./FieldErrorMessage";
import { useId } from "react";

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
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  loading = false,
}) => {
  const labelId = useId();
  const isLabeled = label !== "";

  return (
    <div>
      {isLabeled && (
        <Label htmlFor={labelId} className="block font-medium">
          {label}
        </Label>
      )}
      <Select
        value={value ?? undefined}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger id={labelId}>
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
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledSelect;
