"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import FormActions from "../../shared/FormActions";
import LabeledDateTime from "../../shared/labeled/LabeledDateTime";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import { toLocalDT, fromLocalDT } from "@/app/frontendUtils/helper";

interface StartMoveSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  handleStartMove: () => Promise<void> | void;
  handleSetStartTime?: (value: number) => Promise<void> | void;
  startTime?: number | null;
  timeZone: string;
}

const StartMoveSection: React.FC<StartMoveSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleStartMove,
  handleSetStartTime,
  startTime,
  timeZone,
}) => {
  const hasStartTime = typeof startTime === "number";
  const canManual = Boolean(handleSetStartTime);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [startLocal, setStartLocal] = useState<string>("");

  useEffect(() => {
    if (isEditing && canManual) {
      setStartLocal(hasStartTime ? toLocalDT(startTime!, timeZone) : "");
    }
  }, [isEditing, hasStartTime, startTime, timeZone, canManual]);

  useEffect(() => {
    if (isManual && canManual) {
      setStartLocal(
        hasStartTime
          ? toLocalDT(startTime!, timeZone)
          : toLocalDT(Date.now(), timeZone)
      );
    }
  }, [isManual, hasStartTime, startTime, timeZone, canManual]);

  const handleQuickStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasStartTime) {
      await handleStartMove();
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManual || !hasStartTime) {
      setIsEditing(false);
      return;
    }
    const newStart = fromLocalDT(startLocal, timeZone);
    if (newStart !== startTime) {
      await Promise.resolve(handleSetStartTime!(newStart));
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setStartLocal(hasStartTime ? toLocalDT(startTime!, timeZone) : "");
    setIsEditing(false);
    onCancel?.();
  };

  const beginManualEntry = () => {
    if (!canManual) return;
    setIsEditing(false);
    setIsManual(true);
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManual) return;
    const newStart = fromLocalDT(startLocal, timeZone);
    await handleSetStartTime!(newStart);
    setIsManual(false);
  };

  const handleManualCancel = () => {
    setIsManual(false);
    onCancel?.();
  };

  const showEditButton = hasStartTime;

  const startValue =
    isEditing || isManual
      ? startLocal
      : hasStartTime
        ? toLocalDT(startTime!, timeZone)
        : "";

  const isCompleted = !!startTime;

  return (
    <div>
      <Header3
        isCompleted={isCompleted}
        button={
          showEditButton && (
            <EditToggleButton
              isEditing={isEditing}
              onToggle={() => setIsEditing((v) => !v)}
            />
          )
        }
      >
        Move Start Time
      </Header3>

      <SectionContainer>
        {(hasStartTime || isManual) && (
          <div className="mb-3">
            <LabeledDateTime
              label="Start Time"
              value={startValue}
              onChange={(e) => setStartLocal(e.target.value)}
              isEditing={(isEditing || isManual) && canManual}
            />
          </div>
        )}

        {isEditing ? (
          <FormActions
            onSave={(e) => void handleEditSave(e)}
            onCancel={handleEditCancel}
            isSaving={isSaving}
            error={updateError}
            saveLabel="Save"
            cancelLabel="Cancel"
          />
        ) : isManual ? (
          <FormActions
            onSave={(e) => void handleManualSave(e)}
            onCancel={handleManualCancel}
            isSaving={isSaving}
            error={updateError}
            saveLabel="Save"
            cancelLabel="Cancel"
          />
        ) : !hasStartTime ? (
          <FormActions
            onSave={(e) => void handleQuickStart(e)}
            onCancel={() => (canManual ? beginManualEntry() : onCancel?.())}
            isSaving={isSaving}
            error={updateError}
            saveLabel="Start"
            cancelLabel={canManual ? "Enter Time" : "Cancel"}
          />
        ) : null}
      </SectionContainer>
    </div>
  );
};

export default StartMoveSection;
