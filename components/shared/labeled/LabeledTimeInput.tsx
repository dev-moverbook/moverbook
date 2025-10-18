"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FieldErrorMessage from "./FieldErrorMessage";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import { formatTime } from "@/frontendUtils/helper";

interface LabeledTimeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  min?: string;
  max?: string;
  isEditing?: boolean;
}

const LabeledTimeInput: React.FC<LabeledTimeInputProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
  isEditing = true,
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        label={label}
        value={value?.trim() ? formatTime(value) : ""}
        fallback="—"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="block text-sm font-medium">{label}</Label>
      <Input
        type="time"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledTimeInput;
