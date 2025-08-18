import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import React from "react";

const Deposit = () => {
  const { moveFormData, setMoveFormData, moveFormErrors, setMoveFormErrors } =
    useMoveForm();

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
    </SectionContainer>
  );
};

export default Deposit;
