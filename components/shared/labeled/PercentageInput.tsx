"use client";

import { NumericFormat } from "react-number-format";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "../field/FieldDisplay";
import { Label } from "@/components/ui/label";
import { useId } from "react";

interface PercentageInputProps {
  label?: string;
  value?: number | null;
  onChange: (value: number) => void;
  isEditing?: boolean;
  error?: string | null;
}

const PercentageInput: React.FC<PercentageInputProps> = ({
  label,
  value,
  onChange,
  isEditing = true,
  error,
}) => {
  const labelId = useId();

  if (!isEditing) {
    return (
      <FieldDisplay
        label={label ?? ""}
        value={
          value !== null && value !== undefined ? `${value.toFixed(2)}%` : "N/A"
        }
        fallback="N/A"
      />
    );
  }

  return (
    <div>
      {label && (
        <Label className="block font-medium" htmlFor={labelId}>
          {label}
        </Label>
      )}
      <NumericFormat
        id={labelId}
        value={value === null ? "" : value}
        onValueChange={(values) => {
          const numericValue = values.floatValue ?? 0;
          onChange(numericValue);
        }}
        suffix="%"
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        placeholder="0.00%"
        disabled={!isEditing}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className={`placeholder:text-grayCustom2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full rounded-md border px-2 py-1 text-base bg-transparent text-white ${
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-grayCustom"
        }`}
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default PercentageInput;
