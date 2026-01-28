"use client";

import { useMoveForm } from "@/contexts/MoveFormContext";
import { getMoveDisplayRows } from "@/frontendUtils/helper";
import CostTable from "@/components/move/sections/CostTable";

const CostSummary = () => {
  const { moveFormData, segmentDistances } = useMoveForm();
  const {
    moveFees,
    liabilityCoverage,
    jobTypeRate,
    jobType,
    paymentMethod,
    creditCardFee,
    travelFeeRate,
    travelFeeMethod,
    startingMoveTime,
    endingMoveTime,
  } = moveFormData;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    paymentMethod,
    creditCardFee,
    travelFeeRate,
    travelFeeMethod: travelFeeMethod ?? null,
    getTotal: true,
    startingMoveTime: startingMoveTime ?? 0,
    endingMoveTime: endingMoveTime ?? 0,
    segmentDistances,
  });

  return <CostTable title="Cost" rows={displayRows} boldLastRow={true} />;
};

export default CostSummary;
