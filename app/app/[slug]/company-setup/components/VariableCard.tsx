"use client";

import { useState } from "react";
import { VariableSchema } from "@/types/convex-schemas";
import { Pencil, Save, X } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import { Input } from "@/app/components/ui/input";
import { useUpdateVariable } from "../hooks/useUpdateVariable";
import IconRow from "@/app/components/shared/IconRow";

interface VariableCardProps {
  variable: VariableSchema;
  value: string;
  onChange: (id: string, value: string) => void;
  isEditing: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({
  variable,
  value,
  onChange,
  isEditing,
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium text-lg">{variable.name}</p>

        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => onChange(variable._id, e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="text-grayCustom text-sm">
            Default Value: {variable.defaultValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default VariableCard;
