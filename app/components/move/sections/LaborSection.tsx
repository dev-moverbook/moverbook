"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import { MoveFormErrors } from "@/types/form-types";
import LaborInputs from "./Labor/LaborInputs";
import LaborSummary from "./Labor/LaborSummary";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "../../shared/FormActions";
import { JobType } from "@/types/types";
import FormActionContainer from "../../shared/containers/FormActionContainer";

export interface LaborFormData {
  trucks: number;
  movers: number | null;
  startingMoveTime: number | null;
  endingMoveTime: number | null;
  jobType: JobType;
  jobTypeRate: number | null;
}

interface LaborSectionProps {
  formData: LaborFormData;
  onChange: <K extends keyof LaborFormData>(
    key: K,
    value: LaborFormData[K]
  ) => void;
  errors?: MoveFormErrors;
  setErrors?: (errors: MoveFormErrors) => void;
  isAdd?: boolean;
  isSaving?: boolean;
  updateError?: string | null;
  onSave?: () => void;
  roundTripDrive?: number | null;
  isEditing: boolean;
  onCancel?: () => void;
  setIsEditing?: (value: boolean) => void;
}

const LaborSection: React.FC<LaborSectionProps> = ({
  formData,
  onChange,
  errors = {},
  setErrors,
  isAdd = false,
  isSaving = false,
  updateError,
  onSave,
  roundTripDrive = null,
  isEditing,
  setIsEditing,
  onCancel,
}) => {
  const [tagTrucksType, setTagTrucksType] = useState<"suggested" | "custom">(
    "suggested"
  );
  const [tagMoversType, setTagMoversType] = useState<"suggested" | "custom">(
    "suggested"
  );

  const hourEstimates: Record<number, [number, number]> = {
    1: [1, 2],
    2: [2, 3],
    3: [3, 4],
    4: [4, 5],
  };

  // Remove a specific error by setting it to undefined (no unused destructure bindings)
  const clearError = (field: keyof MoveFormErrors) => {
    if (errors[field] && setErrors) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Use the parameter so it's not flagged as unused
  const handleMoverChangeWithEstimate = (val: number) => {
    onChange("movers", val);
    setTagMoversType("custom");
    clearError("movers");
    // optional: could use hourEstimates[val] to prefill time ranges, etc.
  };

  const handleSave = () => {
    onSave?.();
    setIsEditing?.(false);
  };

  const editingMode = !isAdd && isEditing;

  return (
    <div>
      <Header3
        wrapperClassName=" pt-0"
        showCheckmark={false}
        button={
          !isAdd && (
            <EditToggleButton
              isEditing={isEditing}
              onToggle={
                isEditing
                  ? (onCancel ?? (() => {}))
                  : setIsEditing
                    ? () => setIsEditing(true)
                    : () => {}
              }
            />
          )
        }
      >
        Labor
      </Header3>
      <SectionContainer showBorder={false} className="pb-0">
        <LaborInputs
          formData={formData}
          onChange={onChange}
          clearError={clearError}
          isEditing={isEditing}
          tagTrucksType={tagTrucksType}
          setTagTrucksType={setTagTrucksType}
          tagMoversType={tagMoversType}
          setTagMoversType={setTagMoversType}
          hourEstimates={hourEstimates}
          handleMoverChangeWithEstimate={handleMoverChangeWithEstimate}
          errors={errors}
        />
        <LaborSummary formData={formData} roundTripDrive={roundTripDrive} />
        {editingMode && onCancel && setIsEditing && (
          <FormActionContainer className="mt-4">
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={onCancel}
              isSaving={isSaving}
              error={updateError}
            />
          </FormActionContainer>
        )}
      </SectionContainer>
    </div>
  );
};

export default LaborSection;
