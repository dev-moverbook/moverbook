"use client";

import { Pencil, Trash2 } from "lucide-react";
import { LaborSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import IconButton from "@/app/components/shared/IconButton";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import CustomCard from "@/app/components/shared/CustomCard";
import CardDetailsWrapper from "@/app/components/shared/CardDetailsWrapper";
import CardDetailRow from "@/app/components/shared/CardDetailRow";
import TitleWithBadge from "@/app/components/shared/TitleWithBadge";
import { formatMonthDay } from "@/app/frontendUtils/helper";

interface LaborCardProps {
  laborItem: LaborSchema;
  onEdit: (laborItem: LaborSchema) => void;
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
          value={`$${laborItem.twoMovers}`}
          className="bg-background2"
        />
        <CardDetailRow label="3 Movers" value={`$${laborItem.threeMovers}`} />
        <CardDetailRow
          className="bg-background2"
          label="4 Movers"
          value={`$${laborItem.fourMovers}`}
        />
        <CardDetailRow label="Extra Mover" value={`$${laborItem.extra}`} />
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
