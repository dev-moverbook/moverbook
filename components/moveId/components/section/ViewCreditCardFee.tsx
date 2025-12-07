"use client";

import React, { useState } from "react";
import { useMoveContext } from "@/contexts/MoveContext";
import { MoveCreditCardFeeFormData } from "@/types/form-types";
import { useUpdateMove } from "@/hooks/moves";
import MoveCreditCardFeeSection from "@/components/move/sections/MoveCreditCardSection";

const ViewCreditCardFee = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const initialFormData: MoveCreditCardFeeFormData = {
    creditCardFeeRate: move.creditCardFee,
  };

  const [formData, setFormData] =
    useState<MoveCreditCardFeeFormData>(initialFormData);

  const handleSave = async () => {
    const success = await updateMove({
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

  const handleCreditCardFeeRateChange = (val: number) => {
    setFormData({
      ...formData,
      creditCardFeeRate: val,
    });
  };

  return (
    <MoveCreditCardFeeSection
      isAdd={false}
      creditCardFeeRate={formData.creditCardFeeRate ?? 0}
      handleCreditCardFeeRateChange={handleCreditCardFeeRateChange}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={updateMoveLoading}
      updateError={updateMoveError}
      initialCreditCardFeeRate={initialFormData.creditCardFeeRate ?? 0}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default ViewCreditCardFee;
