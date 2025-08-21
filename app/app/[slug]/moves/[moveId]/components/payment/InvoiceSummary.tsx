// components/InvoiceSummary.tsx
"use client";

import ListRowContainer from "@/app/components/shared/containers/ListRowContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ListRow from "@/app/components/shared/ui/ListRow";
import ReusableCard from "../card/ReusableCard";
import { cn } from "@/lib/utils";
import { DisplayRow, SegmentDistance } from "@/types/types";
import { Doc } from "@/convex/_generated/dataModel";
import {
  computeInvoiceTotals,
  getMoveDisplayRows,
  ListRowType,
} from "@/app/frontendUtils/helper";

interface InvoiceSummaryProps {
  move: Doc<"move"> & {
    segmentDistances: SegmentDistance[];
    paymentMethod: any;
    creditCardFee: number;
    travelFeeRate?: number | null;
    travelFeeMethod: any;
  };
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
  } = move;

  const rows: ListRowType[] = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod,
    paymentMethod,
    creditCardFee,
    startingMoveTime,
    endingMoveTime,
    segmentDistances,
    additionalFees,
    discounts,
    deposit: deposit ?? 0,
    getTotal: true,
    includeInvoiceRow: true,
  });

  const displayRows: DisplayRow[] = rows.map((r) => {
    const rightText = r.right ?? "";
    const isNegative = rightText.trim().startsWith("-");
    return {
      left: r.left,
      right: rightText,
      className: cn(isNegative ? "text-green-500" : undefined),
    };
  });

  const { invoiceMin, invoiceMax } = (() => {
    const totalRow = rows.find((r) => r.left === "Total");
    if (!totalRow) return { invoiceMin: 0, invoiceMax: 0 };
    const text = (totalRow.right ?? "").replace(/[\$,]/g, "");
    let baseMin = 0;
    let baseMax = 0;
    if (text.includes("-")) {
      const [a, b] = text.split("-").map((s) => parseFloat(s.trim()));
      baseMin = isNaN(a) ? 0 : a;
      baseMax = isNaN(b) ? baseMin : b;
    } else {
      const v = parseFloat(text);
      baseMin = isNaN(v) ? 0 : v;
      baseMax = baseMin;
    }
    return computeInvoiceTotals({
      baseMin,
      baseMax,
      additionalFees,
      discounts,
      deposit: deposit ?? 0,
    });
  })();

  const dueToday = invoiceMin === invoiceMax ? invoiceMin : invoiceMax;

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
              className={cn(i % 2 === 1 ? "" : "bg-background2", row.className)}
            />
          ))}
        </ListRowContainer>
      )}

      <SectionContainer>
        <ReusableCard
          title="Due Today"
          texts={[["Total", dueToday, true]]}
          isCurrency
        />
      </SectionContainer>
    </div>
  );
};

export default InvoiceSummary;
