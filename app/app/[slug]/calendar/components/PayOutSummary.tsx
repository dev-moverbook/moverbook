import { useMoveFilter } from "@/app/contexts/MoveFilterContext";
import React from "react";
import ReusableCard from "../../moves/[moveId]/components/card/ReusableCard";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { formatLongDateInZone } from "@/app/frontendUtils/helper";

const PayOutSummary = () => {
  const { timeZone } = useSlugContext();
  const { filterStartDate, filterEndDate } = useMoveFilter();

  return (
    <ReusableCard
      title="Payout Summary"
      texts={[
        [
          "Date Range",
          `${formatLongDateInZone(filterStartDate, timeZone)} - ${formatLongDateInZone(filterEndDate, timeZone)}`,
        ],
        ["Pending", 2, { isCurrency: true }],
        ["Approved", 2, { isCurrency: true, isBold: true }],
      ]}
      className="mt-8"
    />
  );
};

export default PayOutSummary;
