import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import FieldDisplay from "./FieldDisplay";
import FieldErrorMessage from "../labeled/FieldErrorMessage";

interface FieldDateProps {
  label: string;
  name: string;
  value?: string | null;
  isEditing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  fallback?: string;
  min?: string;
  max?: string;
}

const FieldDate: React.FC<FieldDateProps> = ({
  label,
  name,
  value,
  isEditing = true,
  onChange,
  error,
  fallback = "N/A",
  min,
  max,
}) => {
  if (!isEditing) {
    return (
      <FieldDisplay
        label={label}
        value={value ? new Date(value).toLocaleDateString() : undefined}
        fallback={fallback}
      />
    );
  }

  return (
    <div className="relative ">
      <Label htmlFor={name} className="block font-medium mb-1">
        {label}
      </Label>
      <Input
        id={name}
        type="date"
        value={value ?? ""}
        onChange={onChange}
        min={min}
        max={max}
        className={cn(
          "hover:bg-background2 p-2 h-10 text-white bg-transparent pr-2 cursor-pointer [&::-webkit-calendar-picker-indicator]:invert",
          error && "border-red-500"
        )}
      />

      <FieldErrorMessage error={error} />
    </div>
  );
};

export default FieldDate;
