"use client";

import React from "react";
import { MoveSchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ReusableCard from "../card/ReusableCard";
import {
  formatCurrency,
  formatPaymentMethod,
} from "@/app/frontendUtils/helper";
import ListRow from "@/app/components/shared/ui/ListRow";
import ListRowContainer from "@/app/components/shared/containers/ListRowContainer";

interface QuoteCostProps {
  move: MoveSchema;
}

const QuoteCost = ({ move }: QuoteCostProps) => {
  const {
    moveFees,
    liabilityCoverage,
    deposit,
    jobTypeRate,
    jobType,
    depositMethod,
  } = move;

  const jobTypeRateDisplay = jobType === "hourly" ? `Hourly Rate` : `Job Rate`;
  const jobRateValue =
    jobType === "hourly"
      ? `${formatCurrency(jobTypeRate ?? 0)}/hr`
      : `${formatCurrency(jobTypeRate ?? 0)}`;

  const displayRows = [
    ...moveFees.map((fee) => ({
      left: `${fee.name} x${fee.quantity}`,
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
  ];

  return (
    <div>
      <SectionHeader title="Cost" />

      {displayRows.length > 0 && (
        <ListRowContainer>
          {displayRows.map((row, i) => (
            <ListRow
              key={i}
              left={row.left}
              right={row.right}
              className={i % 2 === 1 ? "bg-background2" : ""}
            />
          ))}
        </ListRowContainer>
      )}

      <SectionContainer>
        <ReusableCard
          title="Due Today"
          texts={[
            ["Deposit", deposit ?? 0, true],
            [`(${formatPaymentMethod(depositMethod)})`, null],
          ]}
          isCurrency
        />
      </SectionContainer>
    </div>
  );
};

export default QuoteCost;
