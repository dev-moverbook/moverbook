"use client";

import React from "react";
import IconRow from "@/components/shared/IconRow";
import IconButton from "@/components/shared/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/components/shared/ListItemRow";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/frontendUtils/helper";

interface AdditionalFeeCardProps {
  fee: Doc<"additionalFees">;
  onEdit: (fee: Id<"additionalFees">) => void;
  onDelete: (fee: Id<"additionalFees">) => void;
}

const AdditionalFeeCard: React.FC<AdditionalFeeCardProps> = ({
  fee,
  onEdit,
  onDelete,
}) => {
  const { quantity, name, price, _id } = fee;
  const unitPrice = formatCurrency(price);
  const total = formatCurrency(price * quantity);

  return (
    <ListItemRow className="flex-col items-start">
      <div className="flex w-full items-center justify-between">
        <p className="text-white font-medium">
          {name} ({quantity} @ {unitPrice})
        </p>
        <IconRow>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(_id);
            }}
            icon={<Pencil className="w-4 h-4" />}
            title="Edit"
          />
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(_id);
            }}
            icon={<Trash2 className="w-4 h-4" />}
            variant="outline"
            title="Delete"
          />
        </IconRow>
      </div>
      <p className="text-grayCustom2 text-sm">Total: {total}</p>
    </ListItemRow>
  );
};

export default AdditionalFeeCard;
