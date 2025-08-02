import { useMoveContext } from "@/app/contexts/MoveContext";
import { getMoveDisplayRows } from "@/app/frontendUtils/helper";
import CostTable from "@/app/components/move/sections/CostTable";

interface CostSectionProps {}

const CostSection = ({}: CostSectionProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const { moveFees, liabilityCoverage, jobTypeRate, jobType } = move;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
  });

  return <CostTable title="Cost" rows={displayRows} />;
};

export default CostSection;
