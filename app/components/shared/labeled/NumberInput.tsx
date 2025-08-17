import { NumericFormat } from "react-number-format";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "../FieldDisplay";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import React from "react";

interface NumberInputProps {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  isEditing?: boolean;
  error?: string | null;
  placeholder?: string;
  unit?: string; // e.g. "ft³", "kg", "%"
  alwaysShowUnit?: boolean; // show unit even when empty
  thousandSeparator?: boolean;
  decimalScale?: number; // default 0
  allowNegative?: boolean; // default false
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  isEditing = true,
  error,
  placeholder = "Enter a number",
  unit,
  alwaysShowUnit = false,
  thousandSeparator = true,
  decimalScale = 0,
  allowNegative = false,
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        label={label ?? ""}
        value={
          value !== null
            ? `${value.toLocaleString()}${unit ? ` ${unit}` : ""}`
            : ""
        }
        fallback="N/A"
      />
    );
  }

  const hasValue = value !== null;
  const suffix = unit && hasValue ? ` ${unit}` : undefined;

  return (
    <div className="relative">
      {label && (
        <Label className="text-white block text-sm font-medium pb-1">
          {label}
        </Label>
      )}

      <NumericFormat
        customInput={Input}
        value={hasValue ? value : ""}
        onValueChange={(vals) => {
          if (vals.value === "") onChange(null);
          else onChange(vals.floatValue ?? 0);
        }}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        allowNegative={allowNegative}
        placeholder={placeholder}
        disabled={!isEditing}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        suffix={suffix}
      />

      {unit && !hasValue && alwaysShowUnit && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">
          {unit}
        </span>
      )}

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default NumberInput;
