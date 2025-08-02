"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import { MoveFormData, MoveFormErrors } from "@/types/form-types";

import LaborInputs from "./Labor/LaborInputs";
import LaborSummary from "./Labor/LaborSummary";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "../../shared/FormActions";
import { JobType } from "@/types/types";

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
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(isAdd);
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

  const clearError = (field: keyof MoveFormErrors) => {
    if (errors[field] && setErrors) {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleMoverChangeWithEstimate = (val: number) => {
    const [start, end] = hourEstimates[val] || [
      formData.startingMoveTime,
      formData.endingMoveTime,
    ];
    onChange("movers", val);
    onChange("startingMoveTime", start);
    onChange("endingMoveTime", end);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    const result = onSave?.();
    if (result) {
      setIsEditing(false);
    }
  };

  const editingMode = !isAdd && isEditing;

  return (
    <div>
      <SectionContainer showBorder={false} className="pb-0">
        <Header3
          wrapperClassName="px-0 pt-0"
          showCheckmark={false}
          button={
            !isAdd && (
              <EditToggleButton
                isEditing={isEditing}
                onToggle={() => setIsEditing(!isEditing)}
              />
            )
          }
        >
          Labor
        </Header3>

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
      </SectionContainer>
      <LaborSummary formData={formData} roundTripDrive={roundTripDrive} />
      {editingMode && (
        <FormActions
          onSave={(e) => {
            e.preventDefault();
            handleSave();
          }}
          onCancel={handleCancel}
          isSaving={isSaving}
          error={updateError}
        />
      )}
    </div>
  );
};

export default LaborSection;
