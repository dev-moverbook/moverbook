import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldTextAreaRowProps {
  label: string;
  name: string;
  value?: string | null;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  fallback?: string;
  placeholder?: string;
}

const FieldTextAreaRow: React.FC<FieldTextAreaRowProps> = ({
  label,
  name,
  value = "",
  isEditing,
  onChange,
  error,
  fallback = "N/A",
  placeholder,
}) => {
  if (isEditing) {
    return (
      <div>
        <Label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
        </Label>
        <Textarea
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className={cn(error && "border-red-500")}
          placeholder={placeholder}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <Label className="block font-medium">{label}</Label>
      <p className="text-sm text-grayCustom2 whitespace-pre-line">
        {value?.trim() || fallback}
      </p>
    </div>
  );
};

export default FieldTextAreaRow;
