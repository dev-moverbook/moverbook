"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import CustomCard from "@/components/shared/card/CustomCard";
import CardHeaderWithActions from "@/components/shared/card/CardHeaderWithActions";
import CardDetailsWrapper from "@/components/shared/card/CardDetailsWrapper";
import CardDetailRow from "@/components/shared/card/CardDetailRow";
import TitleWithBadge from "@/components/shared/heading/TitleWithBadge";
import clsx from "clsx";
import { formatCurrency } from "@/frontendUtils/helper";

interface SelectLiabilityCardProps {
  policy?: Doc<"insurancePolicies">;
  isSelected?: boolean;
  onSelect?: (policyId: Id<"insurancePolicies">) => void;
  disabled?: boolean;
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
