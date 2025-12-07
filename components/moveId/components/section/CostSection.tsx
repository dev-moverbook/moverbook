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
    moveFees: moveFees ?? [],
    jobType: jobType ?? "hourly",
    jobTypeRate: jobTypeRate ?? null,
    liabilityCoverage,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod: travelFeeMethod ?? null,
    paymentMethod: paymentMethod ?? { kind: "other", label: "Other" },
    creditCardFee: creditCardFee ?? 0,
    startingMoveTime: startingMoveTime ?? null,
    endingMoveTime: endingMoveTime ?? null,
    segmentDistances: segmentDistances ?? [],
    getTotal: true,
  });

  return <CostTable title="Cost" rows={displayRows} boldLastRow={true} />;
};

export default CostSection;
