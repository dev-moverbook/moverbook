"use client";

import ListRowContainer from "@/components/shared/containers/ListRowContainer";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import ListRow from "@/components/shared/ui/ListRow";
import ReusableCard from "../card/ReusableCard";
import { cn } from "@/lib/utils";
import { CostFormat, DisplayRow } from "@/types/types";
import { formatCurrency } from "@/frontendUtils/helper";

interface InvoiceSummaryProps {
  items: CostFormat[];
  total: number;
}

const InvoiceSummary = ({ items, total }: InvoiceSummaryProps) => {
  const displayRows: DisplayRow[] = items.map(
    (item: CostFormat, index: number) => {
      const rightText = formatCurrency(item.value);
      const isNegative = item.value < 0;
      const isLast = index === items.length - 1;

      return {
        left: item.label,
        right: rightText,
        className: cn(
          index % 2 === 0 ? "bg-background2" : "",
          isNegative ? "text-green-500" : "",
          isLast ? "font-bold" : ""
        ),
      };
    }
  );

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
          texts={[["Total", total, { isCurrency: true, isBold: true }]]}
        />
      </SectionContainer>
    </div>
  );
};

export default InvoiceSummary;
