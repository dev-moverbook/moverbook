"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import { useId } from "react";

interface LabeledTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string | null;
  isEditing?: boolean;
  noPlaceholderError?: boolean;
}

const LabeledTextarea: React.FC<LabeledTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  error,
  isEditing = true,
  noPlaceholderError = false,
}) => {
  if (!isEditing) {
    return <FieldDisplay label={label} value={value?.trim()} fallback="—" />;
  }

  const id = useId();

  return (
    <div className="">
      <Label className="block  font-medium " htmlFor={id}>
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <FieldErrorMessage error={error} noPlaceholder={noPlaceholderError} />
    </div>
  );
};

export default LabeledTextarea;
