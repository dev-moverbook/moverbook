"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface DefaultCheckboxFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const DefaultCheckboxField: React.FC<DefaultCheckboxFieldProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="isDefault" checked={checked} onCheckedChange={onChange} />
      <Label htmlFor="isDefault" className="pb-0">
        {label}
      </Label>
    </div>
  );
};

export default DefaultCheckboxField;
