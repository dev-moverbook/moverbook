import React from "react";
import { Label } from "@/components/ui/label";

interface FieldDisplayProps {
  label: string;
  value?: string | null;
  fallback?: string;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({
  label,
  value,
  fallback = "N/A",
}) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <p className="md:text-sm text-grayCustom2">{value?.trim() || fallback}</p>
    </div>
  );
};

export default FieldDisplay;
