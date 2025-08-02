"use client";

import React, { useState } from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { MoveCreditCardFeeFormData } from "@/types/form-types";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import MoveCreditCardFeeSection from "@/app/components/move/sections/MoveCreditCardSection";

const ViewCreditCardFee = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const initialFormData: MoveCreditCardFeeFormData = {
    creditCardFeeRate: move.creditCardFee ?? null,
  };

  const [formData, setFormData] =
    useState<MoveCreditCardFeeFormData>(initialFormData);

  const handleSave = async () => {
    const { success } = await updateMove({
      moveId: move._id,
      updates: {
        creditCardFee: formData.creditCardFeeRate,
      },
    });
    return success;
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handleCreditCardFeeRateChange = (val: number | null) => {
    setFormData({
      ...formData,
      creditCardFeeRate: val,
    });
  };

  return (
    <MoveCreditCardFeeSection
      isAdd={false}
      creditCardFeeRate={formData.creditCardFeeRate}
      handleCreditCardFeeRateChange={handleCreditCardFeeRateChange}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={updateMoveLoading}
      updateError={updateMoveError}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default ViewCreditCardFee;
