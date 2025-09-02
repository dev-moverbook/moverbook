import { useMoveContext } from "@/app/contexts/MoveContext";
import { getMoveDisplayRows } from "@/app/frontendUtils/helper";
import CostTable from "@/app/components/move/sections/CostTable";
import { computeQuoteMoveCost } from "@/app/frontendUtils/payout";

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

  const { items, total } = computeQuoteMoveCost({
    creditCardFee,
    endingMoveTime: endingMoveTime ?? 0,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    moveFees,
    paymentMethod,
    segmentDistance: segmentDistances[0],
    startingMoveTime: startingMoveTime ?? 0,
    travelFeeMethod: travelFeeMethod ?? null,
    travelFeeRate: travelFeeRate ?? null,
    showTotal: true,
  });

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
