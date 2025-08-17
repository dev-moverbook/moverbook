import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { getMoveDisplayRows } from "@/app/frontendUtils/helper";
import CostTable from "@/app/components/move/sections/CostTable";

const CostSummary = () => {
  const { moveFormData } = useMoveForm();
  const { moveFees, liabilityCoverage, jobTypeRate, jobType } = moveFormData;

  const displayRows = getMoveDisplayRows({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
  });

  return <CostTable title="Cost" rows={displayRows} />;
};

export default CostSummary;
