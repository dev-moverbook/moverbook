import GroupedItemsList from "@/app/app/[slug]/add-move/components/lists/GroupedItemList";
import React, { useState } from "react";
import { MoveSchema } from "@/types/convex-schemas";
import CostSummary from "@/app/app/[slug]/add-move/components/sections/CostSummary";

interface CostSectionProps {
  move: MoveSchema;
}

const CostSection = ({ move }: CostSectionProps) => {
  return <CostSummary />;
};

export default CostSection;
