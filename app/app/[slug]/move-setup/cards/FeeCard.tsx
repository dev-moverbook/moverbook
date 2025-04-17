"use client";

import React from "react";
import { FeeSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import IconRow from "@/app/components/shared/IconRow";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/app/components/shared/ListItemRow";

interface FeeCardProps {
  fee: FeeSchema;
  onEdit: (fee: FeeSchema) => void;
  onDelete: (feeId: Id<"fees">) => void;
}

const FeeCard: React.FC<FeeCardProps> = ({ fee, onEdit, onDelete }) => {
  const formattedPrice = `$${fee.price.toFixed(2)}`;

  return (
    <ListItemRow>
      <div className="flex items-center gap-2 text-white font-medium">
        <span>{fee.name}</span>
        <span className="text-grayCustom2 text-sm">{formattedPrice}</span>
      </div>
      <IconRow>
        <IconButton
          onClick={() => onEdit(fee)}
          icon={<Pencil className="w-4 h-4" />}
          title="Edit"
        />
        <IconButton
          onClick={() => onDelete(fee._id)}
          icon={<Trash2 className="w-4 h-4" />}
          variant="outline"
          title="Delete"
        />
      </IconRow>
    </ListItemRow>
  );
};

export default FeeCard;
