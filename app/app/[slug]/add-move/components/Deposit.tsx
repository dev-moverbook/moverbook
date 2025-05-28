import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header4 from "@/app/components/shared/heading/Header4";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { useCompanyPolicy } from "@/app/hooks/queries/useCompanyPolicy";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

interface DepositProps {
  companyId: Id<"companies">;
}

const Deposit = ({ companyId }: DepositProps) => {
  const { policy, isLoading, isError, errorMessage } =
    useCompanyPolicy(companyId);

  return (
    <SectionContainer>
      <Header4>Deposit</Header4>
      <LabeledInput
        label="Deposit"
        value={policy?.deposit?.toLocaleString() ?? ""}
        type="number"
        onChange={(e) => {
          console.log(e.target.value);
        }}
      />
    </SectionContainer>
  );
};

export default Deposit;
