// app/components/move/sections/MoveTypeSection.tsx
"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import {
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

type MoveWindow = "morning" | "afternoon" | "custom";

export interface MoveTypeSectionProps {
  // values
  serviceType: ServiceType | null;
  moveDate: string | null;
  startWindowOption: StartWindowOption; // "available" | "custom"
  moveWindow: MoveWindow;
  arrivalTimes: {
    arrivalWindowStarts: string | null;
    arrivalWindowEnds: string | null;
  };

  // time slot data (already formatted)
  timeSlotOptions: { label: string; value: string }[] | null;
  timeSlotsLoading?: boolean;
  timeSlotsError?: string | null;

  // editing + save/cancel
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  onSave: () => Promise<boolean> | boolean;
  onCancel: () => void;
  isSaving?: boolean;
  updateError?: string | null;

  // change handlers
  onServiceTypeChange: (v: ServiceType) => void;
  onMoveDateChange: (v: string) => void;
  onStartWindowOptionChange: (v: StartWindowOption) => void;
  onArrivalStartChange: (v: string) => void;
  onArrivalEndChange: (v: string) => void;
  onSelectTimeSlot: (value: string) => void;

  // permissions
  canEdit?: boolean; // hide edit controls when false (e.g., movers)
}

const MoveTypeSection: React.FC<MoveTypeSectionProps> = ({
  // values
  serviceType,
  moveDate,
  startWindowOption,
  moveWindow,
  arrivalTimes,

  // slot data
  timeSlotOptions,
  timeSlotsLoading,
  timeSlotsError,

  // editing
  isEditing,
  setIsEditing,
  onSave,
  onCancel,
  isSaving,
  updateError,

  // handlers
  onServiceTypeChange,
  onMoveDateChange,
  onStartWindowOptionChange,
  onArrivalStartChange,
  onArrivalEndChange,
  onSelectTimeSlot,

  // perms
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
        showCheckmark
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
            isError={!!timeSlotsError}
            fetchErrorMessage={timeSlotsError ?? null}
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
            error={updateError ?? null}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTypeSection;
