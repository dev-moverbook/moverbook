"use client";

import { Input } from "@/components/ui/input";
import { Doc } from "@/convex/_generated/dataModel";

interface VariableCardProps {
  variable: Doc<"variables">;
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
    <div className="flex flex-col justify-between items-start w-full">
      <p className="font-medium text-lg">{variable.name}</p>

      {isEditing ? (
        <Input
          value={value}
          onChange={(e) => onChange(variable._id, e.target.value)}
          className="mt-1"
        />
      ) : (
        <p className="text-grayCustom2 text-sm">
          Default Value: {variable.defaultValue}
        </p>
      )}
    </div>
  );
};

export default VariableCard;
