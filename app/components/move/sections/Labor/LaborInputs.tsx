"use client";

import React from "react";
import ToggleButtonGroup from "@/app/components/shared/labeled/ToggleButtonGroup";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import { JobType } from "@/types/types";
import { MoveFormData, MoveFormErrors } from "@/types/form-types";
import { LaborFormData } from "../LaborSection";
import EditableTruckField from "../EditableTruckField";
import EditableMoverField from "../EditableMoverField";

interface LaborInputsProps {
  formData: LaborFormData;
  onChange: <K extends keyof LaborFormData>(
    key: K,
    value: LaborFormData[K]
  ) => void;
  clearError: (field: keyof MoveFormErrors) => void;
  isEditing: boolean;
  tagTrucksType: "suggested" | "custom";
  setTagTrucksType: (val: "suggested" | "custom") => void;
  tagMoversType: "suggested" | "custom";
  setTagMoversType: (val: "suggested" | "custom") => void;
  hourEstimates: Record<number, [number, number]>;
  handleMoverChangeWithEstimate: (val: number) => void;
  errors?: MoveFormErrors;
}

const LaborInputs: React.FC<LaborInputsProps> = ({
  formData,
  onChange,
  clearError,
  isEditing,
  tagTrucksType,
  setTagTrucksType,
  tagMoversType,
  setTagMoversType,
  hourEstimates,
  handleMoverChangeWithEstimate,
  errors = {},
}) => {
  return (
    <>
      <EditableTruckField
        value={formData.trucks}
        onChange={(val) => onChange("trucks", val as number)}
        tagType={tagTrucksType}
        setTagType={setTagTrucksType}
        isEditing={isEditing}
      />

      <EditableMoverField
        movers={formData.movers ?? 0}
        startingMoveTime={formData.startingMoveTime}
        endingMoveTime={formData.endingMoveTime}
        onChange={onChange}
        clearError={clearError}
        tagType={tagMoversType}
        setTagType={setTagMoversType}
        hourEstimates={hourEstimates}
        handleMoverChangeWithEstimate={handleMoverChangeWithEstimate}
        isEditing={isEditing}
      />

      {/* Job Type and Rate */}
      <ToggleButtonGroup<JobType>
        label="Job Type"
        value={formData.jobType}
        onChange={(val) => {
          onChange("jobType", val);
          clearError("jobType");
        }}
        options={[
          { label: "Hourly", value: "hourly" },
          { label: "Flat", value: "flat" },
        ]}
        isEditing={isEditing}
      />

      <CurrencyInput
        label={
          formData.jobType === "hourly" ? "Hourly Rate ($/hr)" : "Flat Rate ($)"
        }
        value={formData.jobTypeRate ?? 0}
        onChange={(val) => {
          const rounded = val ? Math.round(val * 100) / 100 : null;
          onChange("jobTypeRate", rounded);
          clearError("jobTypeRate");
        }}
        error={errors?.jobTypeRate}
        isEditing={isEditing}
        suffix={formData.jobType === "hourly" ? "/hr" : ""}
      />
    </>
  );
};

export default LaborInputs;
