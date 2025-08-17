import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import ButtonRadioGroup from "@/app/components/shared/labeled/ButtonRadioGroup";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { PAYMENT_METHOD_OPTIONS, PaymentMethod } from "@/types/types";
import React from "react";

const Deposit = () => {
  const { moveFormData, setMoveFormData, moveFormErrors, setMoveFormErrors } =
    useMoveForm();

  const handleDepositMethodChange = (val: PaymentMethod) => {
    setMoveFormData((prev) => ({
      ...prev,
      depositMethod: val,
    }));
  };

  return (
    <SectionContainer>
      <Header3 wrapperClassName="px-0" showCheckmark={false}>
        Deposit
      </Header3>

      <CurrencyInput
        label="Deposit"
        value={moveFormData.deposit}
        onChange={(value) => {
          setMoveFormData((prev) => ({
            ...prev,
            deposit: value != null ? Math.round(value * 100) / 100 : 0,
          }));

          // Remove the deposit error (no functional updater; avoids TS errors)
          if (moveFormErrors.deposit) {
            const nextErrors = { ...moveFormErrors };
            delete nextErrors.deposit;
            setMoveFormErrors(nextErrors);
          }
        }}
        isEditing={true}
        error={moveFormErrors.deposit}
      />

      <ButtonRadioGroup
        name="depositMethod"
        value={moveFormData.depositMethod}
        options={PAYMENT_METHOD_OPTIONS}
        onChange={(val) => handleDepositMethodChange(val as PaymentMethod)}
        label="Deposit Method"
      />
    </SectionContainer>
  );
};

export default Deposit;
