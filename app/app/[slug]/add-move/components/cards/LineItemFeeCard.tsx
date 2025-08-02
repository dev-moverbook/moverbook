"use client";

import React from "react";
import IconRow from "@/app/components/shared/IconRow";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/app/components/shared/ListItemRow";
import { MoveFeeInput } from "@/types/form-types";

interface LineItemFeeCardProps {
  fee: MoveFeeInput;
  onEdit: (fee: MoveFeeInput) => void;
  onDelete: (fee: MoveFeeInput) => void;
}

const LineItemFeeCard: React.FC<LineItemFeeCardProps> = ({
  fee,
  onEdit,
  onDelete,
}) => {
  const unitPrice = `$${fee.price.toFixed(2)}`;
  const total = `$${(fee.price * fee.quantity).toFixed(2)}`;

  return (
    <ListItemRow className="flex-col items-start">
      <div className="flex w-full items-center justify-between">
        <p className="text-white font-medium">
          {fee.name} ({fee.quantity} @ {unitPrice})
        </p>
        <IconRow>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(fee);
            }}
            icon={<Pencil className="w-4 h-4" />}
            title="Edit"
          />
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(fee);
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

export default LineItemFeeCard;
