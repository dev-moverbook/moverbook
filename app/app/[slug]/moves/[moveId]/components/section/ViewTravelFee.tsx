"use client";

import React, { useState } from "react";
import MoveTravelFeeSection from "@/app/components/move/sections/MoveTravelFeeSection";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { TravelChargingTypes } from "@/types/enums";
import { MoveTravelFeeFormData } from "@/types/form-types";
import { useUpdateMove } from "../../../hooks/useUpdateMove";

const ViewTravelFee = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();
  const travelFeeOptions = moveData.travelFee;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const initialFormData: MoveTravelFeeFormData = {
    travelFeeRate: move.travelFeeRate,
    travelFeeMethod: move.travelFeeMethod,
  };

  const [formData, setFormData] =
    useState<MoveTravelFeeFormData>(initialFormData);

  const handleSave = async () => {
    const { success } = await updateMove({
      moveId: move._id,
      updates: {
        travelFeeRate: formData.travelFeeRate,
        travelFeeMethod: formData.travelFeeMethod,
      },
    });
    return success;
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handleTravelFeeMethodChange = (val: TravelChargingTypes | "None") => {
    if (val === "None") {
      setFormData({
        travelFeeMethod: null,
        travelFeeRate: null,
      });
    } else if (val === TravelChargingTypes.MILEAGE) {
      setFormData({
        travelFeeMethod: val,
        travelFeeRate: travelFeeOptions?.mileageRate ?? null,
      });
    } else if (val === TravelChargingTypes.FLAT) {
      setFormData({
        travelFeeMethod: val,
        travelFeeRate: travelFeeOptions?.flatRate ?? null,
      });
    } else if (val === TravelChargingTypes.LABOR_HOURS) {
      setFormData({
        travelFeeMethod: val,
        travelFeeRate: move.jobTypeRate ?? null,
      });
    }
  };

  const handleTravelFeeRateChange = (val: number | null) => {
    setFormData((prev) => ({
      ...prev,
      travelFeeRate: val,
    }));
  };

  return (
    <MoveTravelFeeSection
      isAdd={false}
      travelFeeRate={formData.travelFeeRate}
      travelFeeMethod={formData.travelFeeMethod}
      handleTravelFeeRateChange={handleTravelFeeRateChange}
      handleTravelFeeMethodChange={handleTravelFeeMethodChange}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={updateMoveLoading}
      updateError={updateMoveError}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default ViewTravelFee;
