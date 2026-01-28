"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import { useUpdateMove } from "@/hooks/moves";
import LiabilityCoverageSection from "@/components/move/sections/LiabilityCoverageSection";
import { useCompanyInsurance } from "@/hooks/insurancePolicies";

const ViewLiabilityFee = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();
  const result = useCompanyInsurance(move.companyId);

  const handleSelectPolicy = async (policy: Doc<"insurancePolicies">) => {
    const success = await updateMove({
      moveId: move._id,
      updates: { liabilityCoverage: policy },
    });
    return success;
  };

  return (
    <LiabilityCoverageSection
      selectedPolicy={move.liabilityCoverage}
      policies={result ?? []}
      onSelect={handleSelectPolicy}
      isSaving={updateMoveLoading}
      error={updateMoveError}
      move={move}
    />
  );
};

export default ViewLiabilityFee;
