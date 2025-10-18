"use client";

import IconRow from "@/components/shared/buttons/IconRow";
import IconButton from "@/components/shared/buttons/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import ListItemRow from "@/components/shared/row/ListItemRow";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/frontendUtils/helper";

interface DiscountCardProps {
  discount: Doc<"discounts">;
  onEdit: (discount: Id<"discounts">) => void;
  onDelete: (discount: Id<"discounts">) => void;
}

const DiscountCard: React.FC<DiscountCardProps> = ({
  discount,
  onEdit,
  onDelete,
}) => {
  const { name, price, _id } = discount;
  const formattedPrice = formatCurrency(price);

  return (
    <ListItemRow>
      <div className="items-center gap-2 text-white font-medium">
        <div className="flex  gap-2">
          <p>{name}</p>
        </div>
        <p className="text-grayCustom2 text-sm">{formattedPrice}</p>
      </div>
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
    </ListItemRow>
  );
};

export default DiscountCard;
