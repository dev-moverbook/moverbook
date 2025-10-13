"use client";

import React, { useState } from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { MovePaymentTypeFormData } from "@/types/form-types";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import PaymentTypeSection from "@/app/components/move/sections/Payment/PaymentTypeSection";
import { PaymentMethod } from "@/types/types";

const ViewPaymentType = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const initialFormData: MovePaymentTypeFormData = {
    paymentMethod: move.paymentMethod,
  };

  const [formData, setFormData] =
    useState<MovePaymentTypeFormData>(initialFormData);

  const handleSave = async () => {
    const success = await updateMove({
      moveId: move._id,
      updates: {
        paymentMethod: formData.paymentMethod,
      },
    });
    return success;
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handlePaymentMethodChange = (val: PaymentMethod) => {
    setFormData({
      ...formData,
      paymentMethod: val,
    });
  };

  return (
    <PaymentTypeSection
      isAdd={false}
      paymentMethod={formData.paymentMethod}
      onChange={handlePaymentMethodChange}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={updateMoveLoading}
      updateError={updateMoveError}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default ViewPaymentType;
