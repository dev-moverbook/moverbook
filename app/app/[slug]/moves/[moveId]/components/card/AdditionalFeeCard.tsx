"use client";

import React from "react";
import IconRow from "@/app/components/shared/IconRow";
import IconButton from "@/app/components/shared/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/app/components/shared/ListItemRow";
import { AdditionalFeeSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/app/frontendUtils/helper";

interface AdditionalFeeCardProps {
  fee: AdditionalFeeSchema;
  onEdit: (fee: AdditionalFeeSchema) => void;
  onDelete: (fee: Id<"additionalFees">) => void;
}

const AdditionalFeeCard: React.FC<AdditionalFeeCardProps> = ({
  fee,
  onEdit,
  onDelete,
}) => {
  const { quantity, name, price, _id } = fee;

  const formattedPrice = formatCurrency(price);
  return (
    <ListItemRow>
      <div className="items-center gap-2 text-white font-medium">
        <div className="flex  gap-2">
          <p>{`${quantity}x`}</p>
          <p>{name}</p>
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
            onDelete(_id);
          }}
          icon={<Trash2 className="w-4 h-4" />}
          variant="outline"
          title="Delete"
        />
      </IconRow>
    </ListItemRow>
  );
};

export default AdditionalFeeCard;
