"use client";

import { InsurancePolicySchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import CustomCard from "@/app/components/shared/CustomCard";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import CardDetailsWrapper from "@/app/components/shared/CardDetailsWrapper";
import CardDetailRow from "@/app/components/shared/CardDetailRow";
import TitleWithBadge from "@/app/components/shared/TitleWithBadge";
import clsx from "clsx";
import { formatCurrency } from "@/app/frontendUtils/helper";

interface SelectLiabilityCardProps {
  policy?: InsurancePolicySchema;
  isSelected?: boolean;
  onSelect?: (policyId: Id<"insurancePolicies">) => void;
  disabled?: boolean; // NEW
}

const SelectLiabilityCard: React.FC<SelectLiabilityCardProps> = ({
  policy,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  if (!policy) return null;

  const isClickable = !!onSelect && !disabled;

  return (
    <CustomCard
      className={clsx(
        "transition p-0 pb-2",
        isSelected && "border-greenCustom",
        disabled
          ? "opacity-60 cursor-not-allowed pointer-events-none"
          : "cursor-pointer"
      )}
      onClick={isClickable ? () => onSelect!(policy._id) : undefined}
    >
      <CardHeaderWithActions
        title={
          <TitleWithBadge title={policy.name} showBadge={policy.isDefault} />
        }
      />
      <CardDetailsWrapper>
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

export default SelectLiabilityCard;
