"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import CustomCard from "@/components/shared/card/CustomCard";
import IconButton from "@/components/shared/buttons/IconButton";
import CardHeaderWithActions from "@/components/shared/card/CardHeaderWithActions";
import CardDetailsWrapper from "@/components/shared/card/CardDetailsWrapper";
import CardDetailRow from "@/components/shared/card/CardDetailRow";
import TitleWithBadge from "@/components/shared/heading/TitleWithBadge";
import { formatCurrency } from "@/frontendUtils/helper";

interface LiabilityCardProps {
  policy: Doc<"insurancePolicies">;
  onEdit: (policy: Doc<"insurancePolicies">) => void;
  onDelete: (policyId: Id<"insurancePolicies">) => void;
}

const LiabilityCard: React.FC<LiabilityCardProps> = ({
  policy,
  onEdit,
  onDelete,
}) => {
  const isDefault = policy.isDefault;
  return (
    <CustomCard>
      <CardHeaderWithActions
        title={
          <TitleWithBadge title={policy.name} showBadge={policy.isDefault} />
        }
        className="px-4 py-4"
        actions={
          <>
            <IconButton
              onClick={() => onEdit(policy)}
              icon={<Pencil className="w-4 h-4" />}
              title="Edit"
            />
            {!isDefault && (
              <IconButton
                onClick={() => onDelete(policy._id)}
                icon={<Trash2 className="w-4 h-4" />}
                variant="outline"
                title="Delete"
              />
            )}
          </>
        }
      />
      <CardDetailsWrapper className="mt-0">
        <CardDetailRow
          label="Coverage Amount"
          value={`${formatCurrency(policy.coverageAmount)}/lb`}
        />

        <CardDetailRow
          label="Premium"
          value={`${formatCurrency(policy.premium)}`}
        />
        <CardDetailRow
          label="Coverage Type"
          value={`${formatCurrency(policy.coverageType)}/lb`}
        />
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default LiabilityCard;
