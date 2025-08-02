import MoveCreditCardFeeSection from "@/app/components/move/sections/MoveCreditCardSection";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import React from "react";

const AddCreditCardFee = () => {
  const { moveFormData, setMoveFormData } = useMoveForm();

  const creditCardFeeRate = moveFormData.creditCardFee;

  const handleCreditCardFeeRateChange = (val: number | null) => {
    setMoveFormData((prev) => ({
      ...prev,
      creditCardFeeRate: val,
    }));
  };

  return (
    <MoveCreditCardFeeSection
      isAdd={true}
      creditCardFeeRate={creditCardFeeRate}
      handleCreditCardFeeRateChange={handleCreditCardFeeRateChange}
    />
  );
};

export default AddCreditCardFee;
