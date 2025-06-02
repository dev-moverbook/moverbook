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
  const formattedPrice = `$${fee.price.toFixed(2)}`;

  return (
    <ListItemRow>
      <div className="items-center gap-2 text-white font-medium">
        <div className="flex  gap-2">
          <p>{`${fee.quantity}x`}</p>
          <p>{fee.name}</p>
        </div>
        <p className="text-grayCustom2 text-sm">{formattedPrice}</p>
      </div>
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
    </ListItemRow>
  );
};

export default LineItemFeeCard;
