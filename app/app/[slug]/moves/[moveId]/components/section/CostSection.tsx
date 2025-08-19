import { useMoveContext } from "@/app/contexts/MoveContext";
import { getMoveDisplayRows } from "@/app/frontendUtils/helper";
import CostTable from "@/app/components/move/sections/CostTable";

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
  } = move;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    travelFeeRate,
    travelFeeMethod,
    paymentMethod,
    creditCardFee,
    startingMoveTime: startingMoveTime,
    endingMoveTime: endingMoveTime,
    getTotal: true,
  });

  return <CostTable title="Cost" rows={displayRows} boldLastRow={true} />;
};

export default CostSection;
