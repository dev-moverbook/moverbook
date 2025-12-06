"use client";

import { useEffect, useMemo, useRef } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FormActions from "@/components/shared/buttons/FormActions";
import {
  SERVICE_TYPE_OPTIONS,
  START_WINDOW_OPTIONS,
  ServiceType,
  StartWindowOption,
} from "@/types/types";
import { cn } from "@/lib/utils";
import LabeledDateInput from "@/components/shared/labeled/LabeledDateInput";
import LabeledRadio from "@/components/shared/labeled/LabeledRadio";
import LabeledTimeInput from "@/components/shared/labeled/LabeledTimeInput";
import TimeSlotSelector from "@/components/shared/labeled/TimeSlotSelector";

export interface MoveTypeSectionProps {
  serviceType: ServiceType | null;
  moveDate: string | null;
  startWindowOption: StartWindowOption;
  arrivalTimes: {
    arrivalWindowStarts: string | null;
    arrivalWindowEnds: string | null;
  };
  timeSlotOptions: { label: string; value: string }[] | null;
  timeSlotsLoading?: boolean;
  timeSlotsError?: string | null;

  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  onSave: () => Promise<boolean> | boolean;
  onCancel: () => void;
  isSaving?: boolean;
  updateError?: string | null;

  onServiceTypeChange: (v: ServiceType) => void;
  onMoveDateChange: (v: string) => void;
  onStartWindowOptionChange: (v: StartWindowOption) => void;
  onArrivalStartChange: (v: string) => void;
  onArrivalEndChange: (v: string) => void;
  onSelectTimeSlot: (value: string) => void;

  canEdit?: boolean;
}

const MoveTypeSection: React.FC<MoveTypeSectionProps> = ({
  serviceType,
  moveDate,
  startWindowOption,
  arrivalTimes,
  timeSlotOptions,
  timeSlotsLoading,
  timeSlotsError,
  isEditing,
  setIsEditing,
  onSave,
  onCancel,
  isSaving,
  updateError,
  onServiceTypeChange,
  onMoveDateChange,
  onStartWindowOptionChange,
  onArrivalStartChange,
  onArrivalEndChange,
  onSelectTimeSlot,
  canEdit = true,
}) => {
  const originalRef = useRef<{
    serviceType: ServiceType | null;
    moveDate: string | null;
    startWindowOption: StartWindowOption;
    arrivalWindowStarts: string | null;
    arrivalWindowEnds: string | null;
  } | null>(null);

  const prevEditingRef = useRef<boolean>(false);

  useEffect(() => {
    const wasNotEditing = !prevEditingRef.current;
    const nowEditing = isEditing;

    if (wasNotEditing && nowEditing && !originalRef.current) {
      originalRef.current = {
        serviceType,
        moveDate,
        startWindowOption,
        arrivalWindowStarts: arrivalTimes.arrivalWindowStarts,
        arrivalWindowEnds: arrivalTimes.arrivalWindowEnds,
      };
    }

    if (!nowEditing) {
      originalRef.current = null;
    }

    prevEditingRef.current = nowEditing;
  }, [
    arrivalTimes.arrivalWindowEnds,
    arrivalTimes.arrivalWindowStarts,
    isEditing,
    moveDate,
    serviceType,
    startWindowOption,
  ]);

  const original = originalRef.current;

  const hasChanges = useMemo(() => {
    if (!original) return false;

    return (
      serviceType !== original.serviceType ||
      moveDate !== original.moveDate ||
      startWindowOption !== original.startWindowOption ||
      arrivalTimes.arrivalWindowStarts !== original.arrivalWindowStarts ||
      arrivalTimes.arrivalWindowEnds !== original.arrivalWindowEnds
    );
  }, [
    original,
    serviceType,
    moveDate,
    startWindowOption,
    arrivalTimes.arrivalWindowStarts,
    arrivalTimes.arrivalWindowEnds,
  ]);

  const canSave = isEditing && hasChanges;

  const isCompleted =
    !!serviceType &&
    !!moveDate &&
    !!arrivalTimes.arrivalWindowStarts &&
    !!arrivalTimes.arrivalWindowEnds;

  const handleSave = async () => {
    if (!canSave) {
      return;
    }
    const success = await onSave();
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Move Type"
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onCancelEdit={onCancel}
        className="pb-0 mx-auto"
        isCompleted={isCompleted}
        showCheckmark={canEdit}
        canEdit={canEdit}
      />

      <SectionContainer className={cn("", isEditing && "gap-0")}>
        <LabeledRadio
          label="Service Type"
          name="serviceType"
          value={serviceType || ""}
          options={SERVICE_TYPE_OPTIONS}
          isEditing={isEditing}
          onChange={(val) => onServiceTypeChange(val as ServiceType)}
        />

        <LabeledDateInput
          label="Move Date"
          value={moveDate || ""}
          onChange={(e) => onMoveDateChange(e.target.value)}
          isEditing={isEditing}
        />

        {isEditing && (
          <LabeledRadio
            label="Start Window Option"
            name="startWindow"
            value={startWindowOption}
            options={START_WINDOW_OPTIONS}
            isEditing={isEditing}
            onChange={(val) =>
              onStartWindowOptionChange(val as StartWindowOption)
            }
          />
        )}

        {startWindowOption === "custom" && (
          <div className="flex gap-4">
            <LabeledTimeInput
              label="Arrival Time Begins"
              value={arrivalTimes.arrivalWindowStarts || ""}
              onChange={(e) => onArrivalStartChange(e.target.value)}
              isEditing={isEditing}
            />
            <LabeledTimeInput
              label="Arrival Time Ends"
              value={arrivalTimes.arrivalWindowEnds || ""}
              onChange={(e) => onArrivalEndChange(e.target.value)}
              isEditing={isEditing}
            />
          </div>
        )}

        {startWindowOption === "available" && (
          <TimeSlotSelector
            value={JSON.stringify(arrivalTimes)}
            onChange={onSelectTimeSlot}
            options={timeSlotOptions}
            isEditing={isEditing}
            isLoading={!!timeSlotsLoading}
            fetchErrorMessage={timeSlotsError}
          />
        )}

        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              void handleSave();
            }}
            onCancel={onCancel}
            isSaving={!!isSaving}
            error={updateError}
            disabled={!canSave}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTypeSection;
