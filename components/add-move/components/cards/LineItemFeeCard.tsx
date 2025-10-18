"use client";

import IconRow from "@/components/shared/buttons/IconRow";
import IconButton from "@/components/shared/buttons/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/components/shared/row/ListItemRow";
import { MoveFeeInput } from "@/types/form-types";
import { formatCurrency } from "@/frontendUtils/helper";

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
  const unitPrice = `${formatCurrency(fee.price)}`;
  const total = `${formatCurrency(fee.price * fee.quantity)}`;

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
      <p className="text-grayCustom2">Total: {total}</p>
    </ListItemRow>
  );
};

export default LineItemFeeCard;
