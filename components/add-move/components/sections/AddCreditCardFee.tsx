"use client";

import MoveCreditCardFeeSection from "@/components/move/sections/MoveCreditCardSection";
import { useMoveForm } from "@/contexts/MoveFormContext";

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
      initialCreditCardFeeRate={creditCardFeeRate}
      handleCreditCardFeeRateChange={handleCreditCardFeeRateChange}
    />
  );
};

export default AddCreditCardFee;
