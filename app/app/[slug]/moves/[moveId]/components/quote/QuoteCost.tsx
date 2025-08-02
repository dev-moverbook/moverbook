"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import ReusableCard from "../card/ReusableCard";
import {
  formatPaymentMethod,
  getMoveDisplayRows,
} from "@/app/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";
import CostTable from "@/app/components/move/sections/CostTable";

interface QuoteCostProps {
  move: Doc<"move">;
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

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
  });

  const texts: [string, number | string | null, boolean?][] = [
    ["Deposit", deposit ?? 0, true],
  ];

  if (depositMethod) {
    texts.push([`(${formatPaymentMethod(depositMethod)})`, null]);
  }

  return (
    <div>
      <CostTable title="Cost" rows={displayRows} />

      <SectionContainer>
        <ReusableCard title="Due Today" texts={texts} isCurrency />
      </SectionContainer>
    </div>
  );
};

export default QuoteCost;
