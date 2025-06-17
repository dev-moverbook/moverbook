"use client";

import { Pencil, Trash2 } from "lucide-react";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import CustomCard from "@/app/components/shared/CustomCard";
import IconButton from "@/app/components/shared/IconButton";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import CardDetailsWrapper from "@/app/components/shared/CardDetailsWrapper";
import CardDetailRow from "@/app/components/shared/CardDetailRow";
import TitleWithBadge from "@/app/components/shared/TitleWithBadge";

interface LiabilityCardProps {
  policy: InsurancePolicySchema;
  onEdit: (policy: InsurancePolicySchema) => void;
  onDelete: (policyId: Id<"insurancePolicies">) => void;
}

const LiabilityCard: React.FC<LiabilityCardProps> = ({
  policy,
  onEdit,
  onDelete,
}) => {
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
            <IconButton
              onClick={() => onDelete(policy._id)}
              icon={<Trash2 className="w-4 h-4" />}
              variant="outline"
              title="Delete"
            />
          </>
        }
      />
      <CardDetailsWrapper className="mt-0">
        <CardDetailRow
          label="Coverage Amount"
          value={`$${policy.coverageAmount}/lb`}
        />
        <CardDetailRow label="Premium" value={`$${policy.premium}/lb`} />

        <CardDetailRow label="Premium" value={`$${policy.premium}`} />
        <CardDetailRow
          label="Coverage Type"
          value={`$${policy.coverageType}/lb`}
        />
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default LiabilityCard;
