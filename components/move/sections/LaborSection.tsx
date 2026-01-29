"use client";

import React, { useMemo, useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import { MoveFormData, MoveFormErrors } from "@/types/form-types";
import LaborInputs from "./Labor/LaborInputs";
import LaborSummary from "./Labor/LaborSummary";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "@/components/shared/buttons/FormActions";
import { JobType } from "@/types/types";
import FormActionContainer from "../../shared/containers/FormActionContainer";
import { Doc } from "@/convex/_generated/dataModel";
import { isMoveCompleted } from "@/frontendUtils/moveHelper";

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
  originalData?: LaborFormData;
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
  totalDriveTime: number | null;
  isEditing: boolean;
  onCancel?: () => void;
  setIsEditing?: (value: boolean) => void;
  move: MoveFormData | Doc<"moves">;
}

const LaborSection: React.FC<LaborSectionProps> = ({
  formData,
  originalData,
  onChange,
  errors = {},
  setErrors,
  isAdd = false,
  isSaving = false,
  updateError,
  onSave,
  totalDriveTime = null,
  isEditing,
  setIsEditing,
  onCancel,
  move,
}) => {
  const hideButton = isMoveCompleted(move);
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
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleMoverChangeWithEstimate = (val: number) => {
    onChange("movers", val);
    setTagMoversType("custom");
    clearError("movers");
  };

  const hasChanges = useMemo(() => {
    if (isAdd) {
      return true;
    }

    return (
      formData.trucks !== originalData?.trucks ||
      formData.movers !== originalData?.movers ||
      formData.startingMoveTime !== originalData?.startingMoveTime ||
      formData.endingMoveTime !== originalData?.endingMoveTime ||
      formData.jobType !== originalData?.jobType ||
      formData.jobTypeRate !== originalData?.jobTypeRate
    );
  }, [formData, originalData, isAdd]);

  const handleSave = () => {
    if (!hasChanges) {
      return;
    }
    onSave?.();
    setIsEditing?.(false);
  };

  const editingMode = !isAdd && isEditing;

  return (
    <div>
      <Header3
        wrapperClassName={`${isAdd ? "" : "pt-4"}`}
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
        hideButton={hideButton}
      >
        Labor
      </Header3>

      <SectionContainer  className="pb-0">
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

      <LaborSummary formData={formData} totalDriveTime={totalDriveTime} />

      {editingMode && onCancel && setIsEditing && (
        <FormActionContainer className="mt-8 max-w-screen-sm w-full mx-auto">
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={onCancel}
            isSaving={isSaving}
            error={updateError}
            disabled={!hasChanges}
            saveLabel="Save "
          />
        </FormActionContainer>
      )}
    </div>
  );
};

export default LaborSection;
