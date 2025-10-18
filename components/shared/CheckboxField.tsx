import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        name={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
      />
      <Label className="pb-0" htmlFor={id}>
        {label}
      </Label>
    </div>
  );
};

export default CheckboxField;
