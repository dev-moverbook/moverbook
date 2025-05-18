import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LabeledTextarea;
