"use client";

import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import IconRow from "@/components/shared/buttons/IconRow";
import IconButton from "@/components/shared/buttons/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/components/shared/row/ListItemRow";
import { formatCurrency } from "@/frontendUtils/helper";

interface FeeCardProps {
  fee: Doc<"fees">;
  onEdit: (fee: Doc<"fees">) => void;
  onDelete: (feeId: Id<"fees">) => void;
}

const FeeCard: React.FC<FeeCardProps> = ({ fee, onEdit, onDelete }) => {
  const formattedPrice = formatCurrency(fee.price);

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
