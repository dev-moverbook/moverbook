import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FieldDisplay from "./FieldDisplay";

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
}) => {
  if (isEditing) {
    return (
      <div>
        <Label htmlFor={name}>{label}</Label>
        <Input
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
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <FieldDisplay label={label} value={value?.trim()} fallback={fallback} />
  );
};

export default FieldRow;
