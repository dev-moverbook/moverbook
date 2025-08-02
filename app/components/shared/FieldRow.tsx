import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FieldDisplay from "./FieldDisplay";
import FormErrorMessage from "./error/FormErrorMessage";
import React from "react"; // Needed for `React.Ref`

interface FieldRowProps {
  label: string;
  name: string;
  value?: string | null;
  type?: string;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  fallback?: string;
  placeholder?: string;
  min?: number;
  step?: number;
  inputRef?: React.Ref<HTMLInputElement>; // ← Add this line
}

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  name,
  value = "",
  type = "text",
  isEditing = true,
  onChange,
  error,
  fallback = "N/A",
  placeholder,
  min,
  step,
  inputRef, // ← Destructure it
}) => {
  const isLabeled = label !== "";
  if (isEditing) {
    return (
      <div>
        {isLabeled && <Label htmlFor={name}>{label}</Label>}
        <Input
          ref={inputRef} // ← Use it here
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          min={min}
          step={step}
          className={cn(error && "border-red-500")}
        />
        <FormErrorMessage message={error} />
      </div>
    );
  }

  return (
    <FieldDisplay label={label} value={value?.trim()} fallback={fallback} />
  );
};

export default FieldRow;
