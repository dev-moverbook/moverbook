"use client";

import React from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import ReusableCard from "../card/ReusableCard";
import { getMoveDisplayRows } from "@/frontendUtils/helper";
import CostTable from "@/components/move/sections/CostTable";
import { useMoveContext } from "@/contexts/MoveContext";

const QuoteCost = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const {
    moveFees,
    liabilityCoverage,
    deposit,
    jobTypeRate,
    jobType,
    paymentMethod,
    creditCardFee,
    segmentDistances,
    travelFeeMethod,
    travelFeeRate,
    startingMoveTime,
    endingMoveTime,
  } = move;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    paymentMethod,
    creditCardFee,
    segmentDistances,
    travelFeeMethod: travelFeeMethod ?? null,
    travelFeeRate: travelFeeRate ?? null,
    startingMoveTime,
    endingMoveTime,
  });

  const texts: [
    string,
    number | string | null,
    { isCurrency?: boolean; isBold?: boolean }?,
  ][] = [["Deposit", deposit ?? 0, { isCurrency: true, isBold: true }]];

  return (
    <div>
      <CostTable title="Cost" rows={displayRows} />

      <SectionContainer>
        <ReusableCard title="Due Today" texts={texts} />
      </SectionContainer>
    </div>
  );
};

export default QuoteCost;
