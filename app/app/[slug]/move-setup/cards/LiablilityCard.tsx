"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import CustomCard from "@/app/components/shared/CustomCard";
import IconButton from "@/app/components/shared/IconButton";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import CardDetailsWrapper from "@/app/components/shared/CardDetailsWrapper";
import CardDetailRow from "@/app/components/shared/CardDetailRow";
import TitleWithBadge from "@/app/components/shared/TitleWithBadge";
import { formatCurrency } from "@/app/frontendUtils/helper";

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
