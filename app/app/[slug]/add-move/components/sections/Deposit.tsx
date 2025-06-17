import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import ButtonRadioGroup from "@/app/components/shared/labeled/ButtonRadioGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { PAYMENT_METHOD_OPTIONS, PaymentMethod } from "@/types/types";
import React from "react";

const Deposit = () => {
  const {
    deposit,
    setDeposit,
    isDepositComplete,
    setDepositMethod,
    depositMethod,
  } = useMoveForm();
  return (
    <SectionContainer>
      <Header3 wrapperClassName="px-0" isCompleted={isDepositComplete}>
        Deposit
      </Header3>
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
      <ButtonRadioGroup
        name="depositMethod"
        value={depositMethod}
        options={PAYMENT_METHOD_OPTIONS}
        onChange={(val) => setDepositMethod(val as PaymentMethod)}
        label="Deposit Method"
      />
    </SectionContainer>
  );
};

export default Deposit;
