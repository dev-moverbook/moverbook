"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Label } from "@/components/ui/label";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "../field/FieldDisplay";
import { useId } from "react";
import { formatPhoneNumber } from "react-phone-number-input";

interface PhoneNumberInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  isEditing?: boolean;
  placeholder?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChange,
  error,
  isEditing = false,
  placeholder,
}) => {
  const labelId = useId();

  if (!isEditing) {
    return (
      <FieldDisplay
        label={label || ""}
        value={value ? formatPhoneNumber(value) : "—"}
        fallback="—"
      />
    );
  }

  return (
    <div className="flex flex-col ">
      {label && (
        <Label htmlFor={labelId} className="font-medium">
          {label}
        </Label>
      )}

      <PhoneInput
        id={labelId}
        defaultCountry="US"
        country="US"
        international={false}
        countrySelectProps={{ disabled: true }}
        value={value}
        onChange={(val) => onChange(val ?? "")}
        className="w-full"
        numberInputProps={{
          maxLength: 14,
          placeholder: placeholder ?? "(555) 555-5555",
          className: `
            w-full rounded-md border bg-transparent px-2 py-1 text-base
            shadow-sm transition-colors placeholder:text-grayCustom2
            focus-visible:outline-none focus-visible:ring-1
            disabled:cursor-not-allowed disabled:opacity-50
            md:text-sm text-white
            ${
              error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-grayCustom focus-visible:ring-ring"
            }
          `,
        }}
      />

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default PhoneNumberInput;
