import CardContainer from "@/app/components/shared/CardContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import CostCard from "@/app/components/move/CostCard";
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
