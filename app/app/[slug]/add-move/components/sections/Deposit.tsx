import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import React from "react";

const Deposit = () => {
  const { deposit, setDeposit, isDepositComplete } = useMoveForm();
  return (
    <SectionContainer>
      <Header3 isCompleted={isDepositComplete}>Deposit</Header3>
      <LabeledInput
        label="Deposit"
        value={deposit.toLocaleString() ?? ""}
        type="number"
        onChange={(e) => {
          setDeposit(Number(e.target.value));
        }}
        min={0}
        step={".01"}
      />
    </SectionContainer>
  );
};

export default Deposit;
