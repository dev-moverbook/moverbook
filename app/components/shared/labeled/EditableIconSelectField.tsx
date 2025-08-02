import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import FieldDisplay from "../FieldDisplay";
import FieldErrorMessage from "./FieldErrorMessage";

interface EditableIconSelectFieldProps {
  icon?: React.ReactNode;
  label?: string;
  value?: string | null;
  options: string[];
  isEditing?: boolean;
  onChange?: (value: string) => void;
  error?: string | null;
  fallback?: string;
  placeholder?: string;
}

const EditableIconSelectField: React.FC<EditableIconSelectFieldProps> = ({
  icon,
  label,
  value = "",
  options,
  isEditing = false,
  onChange,
  error,
  fallback = "—",
  placeholder = "Select an option",
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        icon={icon}
        value={value}
        fallback={fallback}
        label="" // Hide label in view mode
      />
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm font-medium text-white">{label}</Label>
      )}
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger className={cn(error && "border-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default EditableIconSelectField;
