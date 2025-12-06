"use client";

import { useState } from "react";
import MoveTravelFeeSection from "@/components/move/sections/MoveTravelFeeSection";
import { useMoveContext } from "@/contexts/MoveContext";
import { TravelChargingTypes } from "@/types/enums";
import { MoveTravelFeeFormData } from "@/types/form-types";
import { useUpdateMove } from "@/hooks/moves";

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
    const success = await updateMove({
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

  const handleTravelFeeMethodChange = (value: TravelChargingTypes | "None") => {
    switch (value) {
      case "None": {
        setFormData({
          travelFeeMethod: null,
          travelFeeRate: null,
        });
        break;
      }
      case TravelChargingTypes.MILEAGE: {
        setFormData({
          travelFeeMethod: value,
          travelFeeRate: travelFeeOptions?.mileageRate ?? null,
        });
        break;
      }
      case TravelChargingTypes.FLAT: {
        setFormData({
          travelFeeMethod: value,
          travelFeeRate: travelFeeOptions?.flatRate ?? null,
        });
        break;
      }
      case TravelChargingTypes.LABOR_HOURS: {
        setFormData({
          travelFeeMethod: value,
          travelFeeRate: move.jobTypeRate ?? null,
        });
        break;
      }
      default: {
        setFormData({
          travelFeeMethod: null,
          travelFeeRate: null,
        });
      }
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
      originalTravelFeeRate={move.travelFeeRate}
      originalTravelFeeMethod={move.travelFeeMethod}
    />
  );
};

export default ViewTravelFee;
