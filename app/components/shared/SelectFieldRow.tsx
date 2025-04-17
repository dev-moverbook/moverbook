import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import FieldDisplay from "./FieldDisplay";

interface SelectFieldRowProps {
  label: string;
  name: string;
  value?: string | null;
  options: string[];
  isEditing?: boolean;
  onChange?: (value: string) => void;
  error?: string;
  fallback?: string;
}

const SelectFieldRow: React.FC<SelectFieldRowProps> = ({
  label,
  name,
  value = "",
  options,
  isEditing = true,
  onChange,
  error,
  fallback = "N/A",
}) => {
  if (isEditing) {
    return (
      <div>
        <Label htmlFor={name}>{label}</Label>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger className={cn(error && "border-red-500")}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            {" "}
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return <FieldDisplay label={label} value={value} fallback={fallback} />;
};

export default SelectFieldRow;
