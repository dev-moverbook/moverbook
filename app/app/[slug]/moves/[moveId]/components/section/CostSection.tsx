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
    creditCardFee,
    travelFeeRate,
    travelFeeMethod,
  } = move;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    creditCardFee,
    travelFeeRate,
    travelFeeMethod,
  });

  return <CostTable title="Cost" rows={displayRows} />;
};

export default CostSection;
