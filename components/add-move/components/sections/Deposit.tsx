"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";
import { useMoveForm } from "@/contexts/MoveFormContext";

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
