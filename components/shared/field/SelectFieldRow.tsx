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
import FieldErrorMessage from "../labeled/FieldErrorMessage";

interface SelectFieldRowProps {
  label: string;
  name: string;
  value?: string | null;
  options: string[];
  isEditing?: boolean;
  onChange?: (value: string) => void;
  error?: string | null;
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
  fallback = "—",
}) => {
  if (isEditing) {
    return (
      <div>
        <Label htmlFor={name} className="block font-medium mb-1">
          {label}
        </Label>
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
        <FieldErrorMessage error={error} />
      </div>
    );
  }

  return <FieldDisplay label={label} value={value} fallback={fallback} />;
};

export default SelectFieldRow;
