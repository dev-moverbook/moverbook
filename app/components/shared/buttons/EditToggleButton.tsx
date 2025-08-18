import React from "react";
import { Pencil, X } from "lucide-react";
import IconButton from "../IconButton";

interface EditToggleButtonProps {
  isEditing: boolean;
  onToggle: () => void;
  title?: string;
}

const EditToggleButton: React.FC<EditToggleButtonProps> = ({
  isEditing,
  onToggle,
  title,
}) => {
  return (
    <IconButton
      className={`${isEditing ? " border-grayCustom " : ""}`}
      icon={
        isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />
      }
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      title={title ?? (isEditing ? "Cancel" : "Edit")}
    >
      {isEditing ? "Cancel" : "Edit"}
    </IconButton>
  );
};

export default EditToggleButton;
