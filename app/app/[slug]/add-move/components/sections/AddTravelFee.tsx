import MoveTravelFeeSection from "@/app/components/move/sections/MoveTravelFeeSection";
import AddTravelFeeSection from "@/app/components/move/sections/MoveTravelFeeSection";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { TravelChargingTypes } from "@/types/enums";
import React from "react";

const AddTravelFee = () => {
  const { moveFormData, setMoveFormData, travelFeeOptions } = useMoveForm();

  const travelFeeRate = moveFormData.travelFeeRate;
  const travelFeeMethod = moveFormData.travelFeeMethod;

  const handleTravelFeeMethodChange = (val: TravelChargingTypes | "None") => {
    if (val === "None") {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: null,
        travelFeeRate: null,
      }));
    } else if (val === TravelChargingTypes.MILEAGE) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: val,
        travelFeeRate: travelFeeOptions?.mileageRate,
      }));
    } else if (val === TravelChargingTypes.FLAT) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: val,
        travelFeeRate: travelFeeOptions?.flatRate,
      }));
    } else if (val === TravelChargingTypes.LABOR_HOURS) {
      setMoveFormData((prev) => ({
        ...prev,
        travelFeeMethod: val,
        travelFeeRate: moveFormData.jobTypeRate,
      }));
    }
  };

  const handleTravelFeeRateChange = (val: number | null) => {
    setMoveFormData((prev) => ({
      ...prev,
      travelFeeRate: val,
    }));
  };

  return (
    <MoveTravelFeeSection
      isAdd={true}
      travelFeeRate={travelFeeRate}
      travelFeeMethod={travelFeeMethod}
      handleTravelFeeRateChange={handleTravelFeeRateChange}
      handleTravelFeeMethodChange={handleTravelFeeMethodChange}
    />
  );
};

export default AddTravelFee;
