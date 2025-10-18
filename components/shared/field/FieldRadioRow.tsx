import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldDisplay from "./FieldDisplay";
import FormErrorMessage from "../error/FormErrorMessage";

interface RadioOption {
  label: string;
  value: string;
}

interface FieldRadioRowProps {
  label: string;
  name: string;
  value?: string | null;
  options: RadioOption[];
  isEditing?: boolean;
  onChange?: (value: string) => void;
  error?: string | null;
  fallback?: string;
}

const FieldRadioRow: React.FC<FieldRadioRowProps> = ({
  label,
  name,
  value,
  options,
  isEditing = true,
  onChange,
  error,
  fallback = "N/A",
}) => {
  if (!isEditing) {
    if (!value) {
      return (
        <FieldDisplay label={label} value={undefined} fallback={fallback} />
      );
    }

    const selected = options.find((o) => o.value === value);
    return (
      <FieldDisplay label={label} value={selected?.label} fallback={fallback} />
    );
  }

  return (
    <div>
      <Label className="block mb-2">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn("flex-wrap gap-4", error && "border-red-500")}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              id={`${name}-${option.value}`}
              value={option.value}
            />
            <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      <FormErrorMessage message={error} />
    </div>
  );
};

export default FieldRadioRow;
