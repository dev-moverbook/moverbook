// components/calendar/PayOutSummary.tsx
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import React, { useMemo } from "react";
import ReusableCard from "../../moves/[moveId]/components/card/ReusableCard";
import { useSlugContext } from "@/app/contexts/SlugContext";
import {
  formatCurrency,
  formatLongDateInZone,
  formatTwoDecimals,
} from "@/app/frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";
import { sumPayoutTotals } from "@/app/frontendUtils/payout";

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
    ? `${formatLongDateInZone(filterStartDate, timeZone)} - ${formatLongDateInZone(filterEndDate, timeZone)}`
    : `${formatLongDateInZone(weekStart, timeZone)} - ${formatLongDateInZone(weekEnd, timeZone)}`;

  const pendingValue = `${formatCurrency(pendingTotal)} (${formatTwoDecimals(pendingHours, "hours")})`;
  const approvedValue = `${formatCurrency(approvedTotal)} (${formatTwoDecimals(approvedHours, "hours")})`;

  return (
    <ReusableCard
      title="Payout Summary"
      texts={[
        ["Date Range", filteredDates],
        ["Pending", pendingValue],
        ["Approved", approvedValue, { isBold: true }],
      ]}
      className="mt-8"
    />
  );
};

export default PayOutSummary;
