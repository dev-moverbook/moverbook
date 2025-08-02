"use client";

import { InsurancePolicySchema } from "@/types/convex-schemas";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyInsurance } from "@/app/hooks/queries/useCompanyInsurance";
import { useMoveContext } from "@/app/contexts/MoveContext";
import LiabilityCoverageSection from "@/app/components/move/sections/LiabilityCoverageSection";

interface LiabilityCoverageProps {}

const MoveIdLiabilityCoverage = ({}: LiabilityCoverageProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const { updateMove, updateMoveError } = useUpdateMove();

  const { data: insurancePolicyOptions } = useCompanyInsurance(move.companyId);

  const handleSelectPolicy = (policy: InsurancePolicySchema) => {
    updateMove({ moveId: move._id, updates: { liabilityCoverage: policy } });
  };

  return (
    <>
      <LiabilityCoverageSection
        selectedPolicy={move.liabilityCoverage}
        policies={insurancePolicyOptions?.insurancePolicies ?? []}
        onSelect={handleSelectPolicy}
        error={updateMoveError}
      />
    </>
  );
};

export default MoveIdLiabilityCoverage;
