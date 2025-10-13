"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import {
  MoveTimes,
  SERVICE_TYPE_OPTIONS,
  START_WINDOW_OPTIONS,
  ServiceType,
  StartWindowOption,
} from "@/types/types";
import { cn } from "@/lib/utils";
import LabeledDateInput from "@/app/components/shared/labeled/LabeledDateInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledTimeInput from "@/app/components/shared/labeled/LabeledTimeInput";
import TimeSlotSelector from "@/app/components/shared/labeled/TimeSlotSelector";

export interface MoveTypeSectionProps {
  serviceType: ServiceType | null;
  moveDate: string | null;
  startWindowOption: StartWindowOption;
  moveWindow: MoveTimes;
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
  moveWindow,
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
  const isCompleted =
    !!serviceType &&
    !!(moveDate || "").toString().trim() &&
    !!moveWindow &&
    !!(arrivalTimes.arrivalWindowStarts || "").toString().trim() &&
    !!(arrivalTimes.arrivalWindowEnds || "").toString().trim();

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
              void onSave();
            }}
            onCancel={onCancel}
            isSaving={!!isSaving}
            error={updateError}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTypeSection;
