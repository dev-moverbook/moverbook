"use client";

import { InsurancePolicySchema, MoveSchema } from "@/types/convex-schemas";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import LiabilityCoverage from "@/app/app/[slug]/add-move/components/sections/LiabilityCoverage";
import { useCompanyInsurance } from "@/app/hooks/queries/useCompanyInsurance";
import FieldErrorMessage from "@/app/components/shared/labeled/FieldErrorMessage";

interface LiabilityCoverageSectionProps {
  move: MoveSchema;
}

const LiabilityCoverageSection = ({ move }: LiabilityCoverageSectionProps) => {
  const { updateMove, updateMoveError } = useUpdateMove();

  const { data: insurancePolicyOptions } = useCompanyInsurance(move.companyId);

  const handleSelectPolicy = (policy: InsurancePolicySchema) => {
    updateMove({ moveId: move._id, updates: { liabilityCoverage: policy } });
  };

  return (
    <>
      <LiabilityCoverage
        insurancePolicyOptions={insurancePolicyOptions?.insurancePolicies}
        insurancePolicy={move.liabilityCoverage}
        onSelectPolicy={handleSelectPolicy}
        error={updateMoveError}
      />
    </>
  );
};

export default LiabilityCoverageSection;
