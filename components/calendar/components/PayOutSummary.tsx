import { useMoveFilter } from "@/contexts/MoveFilterContext";
import React, { useMemo } from "react";
import ReusableCard from "../../moveId/components/card/ReusableCard";
import { useSlugContext } from "@/contexts/SlugContext";
import {
  formatCurrency,
  formatLongDateInZone,
  formatTwoDecimals,
} from "@/frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";
import { sumPayoutTotals } from "@/frontendUtils/payout";

interface PayOutSummaryProps {
  moves: EnrichedMove[];
  weekStart: string;
  weekEnd: string;
}

const PayOutSummary = ({ moves, weekStart, weekEnd }: PayOutSummaryProps) => {
  const { timeZone } = useSlugContext();
  const { filterStartDate, filterEndDate, isList } = useMoveFilter();

  const { pendingTotal, approvedTotal, pendingHours, approvedHours } = useMemo(
    () => sumPayoutTotals(moves),
    [moves]
  );

  const filteredDates = isList
    ? `${formatLongDateInZone(filterStartDate, timeZone)} - ${formatLongDateInZone(
        filterEndDate,
        timeZone
      )}`
    : `${formatLongDateInZone(weekStart, timeZone)} - ${formatLongDateInZone(
        weekEnd,
        timeZone
      )}`;

  const pendingValue = `${formatCurrency(pendingTotal)} (${formatTwoDecimals(
    pendingHours,
    "hours"
  )})`;
  const approvedValue = `${formatCurrency(approvedTotal)} (${formatTwoDecimals(
    approvedHours,
    "hours"
  )})`;

  return (
    <div className="max-w-screen-sm w-full mx-auto px-4 md:px-0 pt-4">
      <ReusableCard
        title="Payout Summary"
        texts={[
          ["Date Range", filteredDates],
          ["Pending", pendingValue],
          ["Approved", approvedValue, { isBold: true }],
        ]}
      />
    </div>
  );
};

export default PayOutSummary;
