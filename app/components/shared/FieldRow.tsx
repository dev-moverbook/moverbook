import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldRowProps {
  label: string;
  name: string;
  value?: string | null;
  type?: string;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  fallback?: string;
}

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  name,
  value = "",
  type = "text",
  isEditing,
  onChange,
  error,
  fallback = "N/A",
}) => {
  if (isEditing) {
    return (
      <div>
        <Label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
        </Label>
        <Input
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          type={type}
          className={cn(error && "border-red-500")}
        />

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <Label className="block text-sm font-medium mb-1">{label}</Label>
      <p className="text-sm text-grayCustom2">{value?.trim() || fallback}</p>
    </div>
  );
};

export default FieldRow;
