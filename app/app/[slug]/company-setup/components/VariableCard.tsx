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
}

const VariableCard: React.FC<VariableCardProps> = ({ variable }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedDefaultValue, setEditedDefaultValue] = useState<string>(
    variable.defaultValue
  );

  const { updateVariable, updateLoading, updateError, setUpdateError } =
    useUpdateVariable();

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateError(null); // Clear error if re-editing
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDefaultValue(variable.defaultValue); // Reset changes
    setUpdateError(null);
  };

  const handleSave = async () => {
    const success = await updateVariable(variable._id, {
      defaultValue: editedDefaultValue,
    });
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-lg">{variable.name}</p>

        {isEditing ? (
          <Input
            value={editedDefaultValue}
            onChange={(e) => setEditedDefaultValue(e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="text-gray-600 text-sm">
            Default: {variable.defaultValue}
          </p>
        )}

        {updateError && (
          <p className="text-sm text-red-500 mt-1">{updateError}</p>
        )}
      </div>

      <IconRow>
        {isEditing ? (
          <>
            <IconButton
              icon={<Save size={16} />}
              aria-label="Save"
              onClick={handleSave}
              disabled={updateLoading}
            />
            <IconButton
              icon={<X size={16} />}
              aria-label="Cancel"
              onClick={handleCancel}
            />
          </>
        ) : (
          <IconButton
            icon={<Pencil size={16} />}
            aria-label="Edit"
            onClick={handleEditClick}
          />
        )}
      </IconRow>
    </div>
  );
};

export default VariableCard;
