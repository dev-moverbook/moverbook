import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header4 from "@/app/components/shared/heading/Header4";
import { useCompanyInsurance } from "@/app/hooks/queries/useCompanyInsurance";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import ChangeLiabilityCoverageModal from "./modals/ChangeLiabilityCoverageModal";

interface LiabilityCoverageProps {
  companyId: Id<"companies">;
}

const LiabilityCoverage = ({ companyId }: LiabilityCoverageProps) => {
  const { data, isLoading, isError, errorMessage } =
    useCompanyInsurance(companyId);
  const [isInsurancePolicyModalOpen, setIsInsurancePolicyModalOpen] =
    useState(false);

  return (
    <SectionContainer>
      <Header4>Liability Coverage</Header4>
      <Button onClick={() => setIsInsurancePolicyModalOpen(true)}>
        Edit Insurance Policy
      </Button>
      <ChangeLiabilityCoverageModal
        isOpen={isInsurancePolicyModalOpen}
        onClose={() => setIsInsurancePolicyModalOpen(false)}
        coverage={data?.insurancePolicies}
      />
    </SectionContainer>
  );
};

export default LiabilityCoverage;
