"use client";

import { InsurancePolicySchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import CustomCard from "@/app/components/shared/CustomCard";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import CardDetailsWrapper from "@/app/components/shared/CardDetailsWrapper";
import CardDetailRow from "@/app/components/shared/CardDetailRow";
import TitleWithBadge from "@/app/components/shared/TitleWithBadge";
import clsx from "clsx";

interface SelectLiabilityCardProps {
  policy: InsurancePolicySchema;
  isSelected: boolean;
  onSelect: (policyId: Id<"insurancePolicies">) => void;
}

const SelectLiabilityCard: React.FC<SelectLiabilityCardProps> = ({
  policy,
  isSelected,
  onSelect,
}) => {
  return (
    <CustomCard
      className={clsx(
        "cursor-pointer border-2 transition",
        isSelected ? "border-greenCustom" : ""
      )}
      onClick={() => onSelect(policy._id)}
    >
      <CardHeaderWithActions
        title={
          <TitleWithBadge title={policy.name} showBadge={policy.isDefault} />
        }
      />
      <CardDetailsWrapper>
        <CardDetailRow
          label="Coverage Amount"
          value={`$${policy.coverageAmount}/lb`}
        />
        <CardDetailRow label="Premium" value={`$${policy.premium}`} />
        <CardDetailRow
          label="Coverage Type"
          value={`$${policy.coverageType}/lb`}
        />
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default SelectLiabilityCard;
