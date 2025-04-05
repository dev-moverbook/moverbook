import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  type?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  error,
  type = "text",
}) => {
  return (
    <div>
      <Label className="block text-sm font-medium mb-1">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LabeledInput;
