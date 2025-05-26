import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FieldErrorMessage from "./FieldErrorMessage";

interface LabeledTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string | null;
}

const LabeledTextarea: React.FC<LabeledTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  error,
}) => {
  return (
    <div>
      <Label className="block text-sm font-medium mb-1">{label}</Label>
      <Textarea value={value} onChange={onChange} placeholder={placeholder} />
      <FieldErrorMessage error={error} />
    </div>
  );
};

export default LabeledTextarea;
