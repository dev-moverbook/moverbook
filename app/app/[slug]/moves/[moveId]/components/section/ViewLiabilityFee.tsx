"use client";

import { useMoveContext } from "@/app/contexts/MoveContext";
import { Doc } from "@/convex/_generated/dataModel";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import LiabilityCoverageSection from "@/app/components/move/sections/LiabilityCoverageSection";
import { useCompanyInsurance } from "@/app/hooks/queries/useCompanyInsurance";

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
    />
  );
};

export default ViewLiabilityFee;
