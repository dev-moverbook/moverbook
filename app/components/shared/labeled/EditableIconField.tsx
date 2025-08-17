import React from "react";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import { formatPhoneNumber } from "@/app/frontendUtils/helper";
import FieldDisplay from "../FieldDisplay";
import { PatternFormat } from "react-number-format";

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
      ? formatPhoneNumber(value)
      : value?.trim();

    return (
      <FieldDisplay
        value={displayValue ? `${displayValue}${suffix ? suffix : ""}` : ""}
        icon={icon}
        fallback={fallback}
        label=""
      />
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white">{label}</label>
      )}
      {isPhoneNumber ? (
        <PatternFormat
          format="(###) ###-####"
          mask="_"
          value={value}
          onValueChange={(values) => {
            onChange(values.value); // only digits
          }}
          placeholder={placeholder || "(305) 613-4423"}
          className={`w-full rounded-md border bg-transparent px-2 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent md:file:text-sm file:font-medium file:text-foreground placeholder:text-grayCustom2 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white ${
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-grayCustom focus-visible:ring-ring"
          }`}
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
