import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import React, { useMemo } from "react";
import ReusableCard from "../../moves/[moveId]/components/card/ReusableCard";
import { useSlugContext } from "@/app/contexts/SlugContext";
import {
  formatLongDateInZone,
  getMovePayoutAmount,
} from "@/app/frontendUtils/helper";
import { EnrichedMove } from "@/types/convex-responses";

interface PayOutSummaryProps {
  moves: EnrichedMove[];
  weekStart: string;
  weekEnd: string;
}

const PayOutSummary = ({ moves, weekStart, weekEnd }: PayOutSummaryProps) => {
  const { timeZone } = useSlugContext();
  const { filterStartDate, filterEndDate, isList } = useMoveFilter();

  const { pendingTotal, approvedTotal } = useMemo(() => {
    let pending = 0;
    let approved = 0;

    for (const move of moves) {
      const amount = getMovePayoutAmount(move);
      if (move.hourStatus === "pending") {
        pending += amount;
      }
      if (move.hourStatus === "approved") {
        approved += amount;
      }
    }

    return { pendingTotal: pending, approvedTotal: approved };
  }, [moves]);

  const filteredDates = isList
    ? `${formatLongDateInZone(filterStartDate, timeZone)} - ${formatLongDateInZone(filterEndDate, timeZone)}`
    : `${formatLongDateInZone(weekStart, timeZone)} - ${formatLongDateInZone(weekEnd, timeZone)}`;

  return (
    <ReusableCard
      title="Payout Summary"
      texts={[
        ["Date Range", filteredDates],
        ["Pending", pendingTotal, { isCurrency: true }],
        ["Approved", approvedTotal, { isCurrency: true, isBold: true }],
      ]}
      className="mt-8"
    />
  );
};

export default PayOutSummary;
