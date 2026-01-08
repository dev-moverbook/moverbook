"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "../field/FieldDisplay";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { formatPhoneNumber } from "react-phone-number-input";

interface EditableIconFieldProps {
  icon?: React.ReactNode;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | null;
  placeholder?: string;
  isEditing?: boolean;
  isPhoneNumber?: boolean;
  type?: string;
  fallback?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  suffix?: string;
}

const EditableIconField: React.FC<EditableIconFieldProps> = ({
  icon,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "",
  isEditing = false,
  isPhoneNumber = false,
  type = "text",
  fallback = "—",
  inputRef,
  suffix,
}) => {
  if (!isEditing) {
    const displayValue = isPhoneNumber
      ? value
        ? formatPhoneNumber(value)
        : ""
      : value?.trim();

    return (
      <FieldDisplay
        value={displayValue ? `${displayValue}${suffix ?? ""}` : ""}
        icon={icon}
        fallback={fallback}
        label=""
      />
    );
  }

  return (
    <div className="space-y-1">
      {label && <label className="block font-medium">{label}</label>}

      {isPhoneNumber ? (
        <PhoneInput
          defaultCountry="US"
          country="US"
          international={false}
          countrySelectProps={{ disabled: true }}
          value={value}
          onChange={(val) => onChange(val ?? "")}
          className="w-full"
          numberInputProps={{
            placeholder: placeholder || "(555) 555-5555",
            onBlur,
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
      ) : (
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          error={error}
        />
      )}

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default EditableIconField;
