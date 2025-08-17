import React from "react";
import { Label } from "@/components/ui/label";

interface FieldDisplayProps {
  label: string;
  value?: string | null;
  fallback?: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({
  label,
  value,
  fallback = "N/A",
  icon,
  valueClassName = " text-grayCustom2",
}) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {icon}
        <p className={valueClassName}>{value?.trim() || fallback}</p>
      </div>
    </div>
  );
};

export default FieldDisplay;
