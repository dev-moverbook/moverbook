"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import IconButton from "@/components/shared/buttons/IconButton";
import CardHeaderWithActions from "@/components/shared/card/CardHeaderWithActions";
import CustomCard from "@/components/shared/card/CustomCard";
import CardDetailsWrapper from "@/components/shared/card/CardDetailsWrapper";
import CardDetailRow from "@/components/shared/card/CardDetailRow";
import TitleWithBadge from "@/components/shared/heading/TitleWithBadge";
import { formatCurrency, formatMonthDay } from "@/frontendUtils/helper";

interface LaborCardProps {
  laborItem: Doc<"labor">;
  onEdit: (laborItem: Doc<"labor">) => void;
  onDelete: (laborId: Id<"labor">) => void;
}

const LaborCard: React.FC<LaborCardProps> = ({
  laborItem,
  onEdit,
  onDelete,
}) => {
  return (
    <CustomCard>
      <CardHeaderWithActions
        title={
          <TitleWithBadge
            title={laborItem.name}
            showBadge={laborItem.isDefault}
          />
        }
        actions={
          <>
            <IconButton
              onClick={() => onEdit(laborItem)}
              icon={<Pencil className="w-4 h-4" />}
              title="Edit"
            />
            {!laborItem.isDefault && (
              <IconButton
                onClick={() => onDelete(laborItem._id)}
                icon={<Trash2 className="w-4 h-4" />}
                variant="outline"
                title="Delete"
              />
            )}
          </>
        }
      />
      <CardDetailsWrapper>
        <CardDetailRow
          label="2 Movers"
          value={`${formatCurrency(laborItem.twoMovers)}`}
        />
        <CardDetailRow
          label="3 Movers"
          value={`${formatCurrency(laborItem.threeMovers)}`}
        />
        <CardDetailRow
          label="4 Movers"
          value={`${formatCurrency(laborItem.fourMovers)}`}
        />
        <CardDetailRow
          label="Extra Mover"
          value={`${formatCurrency(laborItem.extra)}`}
        />
        {laborItem.startDate != null && (
          <CardDetailRow
            label="Start Date"
            value={formatMonthDay(laborItem.startDate)}
          />
        )}
        {laborItem.endDate != null && (
          <CardDetailRow
            label="End Date"
            value={formatMonthDay(laborItem.endDate)}
          />
        )}
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default LaborCard;
