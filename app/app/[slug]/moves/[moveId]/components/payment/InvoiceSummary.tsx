// components/InvoiceSummary.tsx
"use client";

import ListRowContainer from "@/app/components/shared/containers/ListRowContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ListRow from "@/app/components/shared/ui/ListRow";
import ReusableCard from "../card/ReusableCard";
import { cn } from "@/lib/utils";
import { DisplayRow } from "@/types/types";
import { Doc } from "@/convex/_generated/dataModel";
import {
  computeInvoiceTotals,
  computeMoveTotal,
  getMoveDisplayRows,
  ListRowType,
} from "@/app/frontendUtils/helper";

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
  const {
    liabilityCoverage,
    moveFees,
    deposit,
    jobTypeRate,
    jobType,
    startingMoveTime,
    endingMoveTime,
    segmentDistances,
    travelFeeMethod,
    travelFeeRate,
    paymentMethod,
    creditCardFee,
    actualBreakTime,
    actualStartTime,
    actualEndTime,
  } = move;

  const rows: ListRowType[] = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod: travelFeeMethod ?? null,
    paymentMethod,
    creditCardFee,
    startingMoveTime,
    endingMoveTime,
    actualStartTime,
    actualEndTime,
    actualBreakTime,
    segmentDistances,
    additionalFees,
    discounts,
    deposit: deposit ?? 0,
    getTotal: true,
    includeInvoiceRow: true,
  });

  const displayRows: DisplayRow[] = rows.map((r, i) => {
    const rightText = r.right ?? "";
    const isNegative = rightText.trim().startsWith("-");
    return {
      left: r.left,
      right: rightText,
      className: cn(
        i % 2 === 1 ? "" : "bg-background2",
        isNegative ? "text-green-500" : undefined
      ),
    };
  });

  const { minTotal, maxTotal } = computeMoveTotal({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod: travelFeeMethod ?? null,
    segmentDistances,
    paymentMethod,
    creditCardFee,
    startingMoveTime,
    endingMoveTime,
    actualStartTime,
    actualEndTime,
    actualBreakTime,
  });

  const { invoiceMax } = computeInvoiceTotals({
    baseMin: minTotal,
    baseMax: maxTotal,
    additionalFees,
    discounts,
    deposit: deposit ?? 0,
  });

  const dueToday = invoiceMax;

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
              className={row.className}
            />
          ))}
        </ListRowContainer>
      )}

      <SectionContainer>
        <ReusableCard
          title="Due Today"
          texts={[["Total", dueToday, { isCurrency: true, isBold: true }]]}
        />
      </SectionContainer>
    </div>
  );
};

export default InvoiceSummary;
