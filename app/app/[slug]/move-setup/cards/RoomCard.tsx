"use client";

import React from "react";
import { X, Pencil } from "lucide-react";
import IconButton from "@/app/components/shared/IconButton";
import { Id } from "@/convex/_generated/dataModel";

interface SelectCardProps {
  id: Id<"rooms">;
  label: string;
  mode?: "edit" | "delete";
  showEditIcon?: boolean;
  onEdit: () => void;
  onDelete: (id: Id<"rooms">) => void;
}

const SelectCard: React.FC<SelectCardProps> = ({
  id,
  label,
  mode,
  showEditIcon = false,
  onEdit,
  onDelete,
}) => {
  const handleCardClick = () => {
    if (mode === "edit") {
      onEdit();
    } else if (mode === "delete") {
      onDelete(id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative border border-grayCustom shadow-white rounded shadow-sm hover:shadow-md transition w-[100px] h-[60px] cursor-pointer flex items-center justify-center text-center"
    >
      {showEditIcon && (
        <div className="absolute -top-3 -right-3 z-10">
          <IconButton
            icon={
              mode === "delete" ? (
                <X size={14} className="text-white" />
              ) : (
                <Pencil size={14} className="text-white" />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "delete") {
                onDelete(id);
              } else {
                onEdit();
              }
            }}
            className={
              mode === "delete"
                ? "bg-red-500 border-none"
                : "bg-greenCustom text-white"
            }
          />
        </div>
      )}

      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default SelectCard;
