"use client";

import LabeledDateTime from "../../shared/labeled/LabeledDateTime";
import FormActions from "@/components/shared/buttons/FormActions";
import BreakTimeInput from "../../shared/labeled/BreakTimeInput";

interface MoverSectionContentProps {
  hasStartTime: boolean;
  hasEndTime: boolean;
  isEditing: boolean;
  manualTarget: "start" | "end" | null;
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  isSaving: boolean;
  updateError?: string | null;
  saveLabel: string;
  canStart: boolean;
  canEnd: boolean;
  onQuickAction: (event: React.FormEvent) => void;
  onEditSave: (event: React.FormEvent) => void;
  onEditCancel: () => void;
  onManualSave: (event: React.FormEvent) => void;
  onManualCancel: () => void;
  beginManualEntry: () => void;
  breakHours: number;
  breakMinutes: number;
  onBreakHoursChange: (hours: number) => void;
  onBreakMinutesChange: (minutes: number) => void;
}

const MoverSectionContent: React.FC<MoverSectionContentProps> = ({
  hasStartTime,
  hasEndTime,
  isEditing,
  manualTarget,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  isSaving,
  updateError,
  saveLabel,
  canStart,
  canEnd,
  onQuickAction,
  onEditSave,
  onEditCancel,
  onManualSave,
  onManualCancel,
  beginManualEntry,
  breakHours,
  breakMinutes,
  onBreakHoursChange,
  onBreakMinutesChange,
}) => {
  return (
    <>
      {(hasStartTime || manualTarget === "start") && (
        <div className="mb-3">
          <LabeledDateTime
            label="Start Time"
            value={startValue}
            onChange={(event) => onStartChange(event.target.value)}
            isEditing={isEditing || manualTarget === "start"}
          />
        </div>
      )}

      {(hasEndTime || manualTarget === "end") && (
        <div className="mb-3">
          <LabeledDateTime
            label="End Time"
            value={endValue}
            onChange={(event) => onEndChange(event.target.value)}
            isEditing={isEditing || manualTarget === "end"}
          />
        </div>
      )}

      {hasStartTime && (
        <BreakTimeInput
          isEditing={isEditing}
          hours={breakHours}
          minutes={breakMinutes}
          onHoursChange={onBreakHoursChange}
          onMinutesChange={onBreakMinutesChange}
        />
      )}

      {isEditing ? (
        <FormActions
          onSave={onEditSave}
          onCancel={onEditCancel}
          isSaving={isSaving}
          error={updateError}
          saveLabel="Save"
          cancelLabel="Cancel"
        />
      ) : manualTarget ? (
        <FormActions
          onSave={onManualSave}
          onCancel={onManualCancel}
          isSaving={isSaving}
          error={updateError}
          saveLabel="Save"
          cancelLabel="Cancel"
        />
      ) : canStart || canEnd ? (
        <FormActions
          onSave={onQuickAction}
          onCancel={beginManualEntry}
          isSaving={isSaving}
          error={updateError}
          saveLabel={saveLabel}
          cancelLabel="Enter Time"
        />
      ) : null}
    </>
  );
};

export default MoverSectionContent;
