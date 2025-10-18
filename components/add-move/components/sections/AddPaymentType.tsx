// AddPaymentType.tsx
"use client";

import PaymentTypeSection from "@/components/move/sections/Payment/PaymentTypeSection";
import { useMoveForm } from "@/contexts/MoveFormContext";
import { PaymentMethod } from "@/types/types";
import React from "react";

const AddPaymentType = () => {
  const { moveFormData, setMoveFormData } = useMoveForm();
  const paymentMethod = moveFormData.paymentMethod;

  const handlePaymentMethodChange = (val: PaymentMethod) => {
    setMoveFormData((prev) => ({
      ...prev,
      paymentMethod: val,
    }));
  };

  return (
    <PaymentTypeSection
      isAdd={true}
      paymentMethod={paymentMethod}
      onChange={handlePaymentMethodChange}
    />
  );
};

export default AddPaymentType;
