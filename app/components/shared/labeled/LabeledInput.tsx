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
      <p
        className={`text-sm mt-1 h-5 transition-opacity duration-200 ${error ? "text-red-500 opacity-100" : "opacity-0"}`}
      >
        {error || " "}
      </p>
    </div>
  );
};

export default LabeledInput;
