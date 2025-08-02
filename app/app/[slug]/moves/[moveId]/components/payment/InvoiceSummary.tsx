"use client";

import ListRowContainer from "@/app/components/shared/containers/ListRowContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ListRow from "@/app/components/shared/ui/ListRow";
import { formatCurrency } from "@/app/frontendUtils/helper";
import ReusableCard from "../card/ReusableCard";
import { cn } from "@/lib/utils";
import { DisplayRow } from "@/types/types";
import { Doc } from "@/convex/_generated/dataModel";

interface InvoiceSummaryProps {
  move: Doc<"move">;
  discounts: Doc<"discounts">[];
  additionalFees: Doc<"additionalFees">[];
}

const InvoiceSummary = ({
  move,
  discounts,
  additionalFees,
}: InvoiceSummaryProps) => {
  const { liabilityCoverage, moveFees, deposit, jobTypeRate, jobType } = move;

  const jobTypeRateDisplay = jobType === "hourly" ? `Hourly Rate` : `Job Rate`;
  const jobRateValue =
    jobType === "hourly"
      ? `${formatCurrency(jobTypeRate ?? 0)}/hr`
      : `${formatCurrency(jobTypeRate ?? 0)}`;

  const displayRows: DisplayRow[] = [
    ...moveFees.map((fee) => ({
      left: `${fee.name} (${fee.quantity} @ ${formatCurrency(fee.price)})`,
      right: `$${(fee.price * fee.quantity).toFixed(2)}`,
    })),
    {
      left: "Liability Coverage",
      right: formatCurrency(liabilityCoverage?.premium ?? 0),
    },
    {
      left: jobTypeRateDisplay,
      right: jobRateValue,
    },

    ...additionalFees.map((fee) => ({
      left: fee.name,
      right: `${formatCurrency(fee.price)}`,
    })),
    ...(deposit && deposit > 0
      ? [
          {
            left: "Deposit",
            right: `-${formatCurrency(deposit)}`,
            className: "text-green-500",
          },
        ]
      : []),

    ...discounts.map((discount) => ({
      left: `${discount.name} (discount)`,
      right: `-${formatCurrency(discount.price)}`,
      className: "text-green-500", // Add className here
    })),
  ];

  return (
    <div>
      <SectionHeader className="mx-auto" title="Invoice Summary" />
      {displayRows.length > 0 && (
        <ListRowContainer>
          {displayRows.map((row, i) => (
            <ListRow
              key={i}
              left={row.left}
              right={row.right}
              className={cn(
                i % 2 === 1 ? "" : "bg-background2",
                row.className // Include custom row styling if provided
              )}
            />
          ))}
        </ListRowContainer>
      )}
      <SectionContainer>
        <ReusableCard
          title="Due Today"
          texts={[["Total", deposit ?? 0, true]]}
          isCurrency
        />
      </SectionContainer>
    </div>
  );
};

export default InvoiceSummary;
