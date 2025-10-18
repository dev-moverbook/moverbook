"use client";
import { useMoveContext } from "@/contexts/MoveContext";
import { getMoveDisplayRows } from "@/frontendUtils/helper";
import CostTable from "@/components/move/sections/CostTable";

const CostSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const {
    moveFees,
    liabilityCoverage,
    jobTypeRate,
    jobType,
    travelFeeRate,
    travelFeeMethod,
    paymentMethod,
    creditCardFee,
    startingMoveTime,
    endingMoveTime,
    segmentDistances,
  } = move;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod: travelFeeMethod ?? null,
    paymentMethod,
    creditCardFee,
    startingMoveTime: startingMoveTime ?? null,
    endingMoveTime: endingMoveTime ?? null,
    segmentDistances,
    getTotal: true,
  });

  return <CostTable title="Cost" rows={displayRows} boldLastRow={true} />;
};

export default CostSection;
