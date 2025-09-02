"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import FormActions from "../../shared/FormActions";
import LabeledDateTime from "../../shared/labeled/LabeledDateTime";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import { toLocalDT, fromLocalDT } from "@/app/frontendUtils/helper";

interface EndMoveSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  handleEndMove: () => Promise<void> | void;
  handleSetEndMove: (value: number) => Promise<void> | void;
  endMoveTime?: number | null;
  timeZone: string;
}

const EndMoveSection: React.FC<EndMoveSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleEndMove,
  handleSetEndMove,
  endMoveTime,
  timeZone,
}) => {
  const hasEndMoveTime = typeof endMoveTime === "number";
  const canManual = Boolean(handleSetEndMove);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [startLocal, setStartLocal] = useState<string>("");

  useEffect(() => {
    if (isEditing && canManual) {
      setStartLocal(hasEndMoveTime ? toLocalDT(endMoveTime!, timeZone) : "");
    }
  }, [isEditing, hasEndMoveTime, endMoveTime, timeZone, canManual]);

  useEffect(() => {
    if (isManual && canManual) {
      setStartLocal(
        hasEndMoveTime
          ? toLocalDT(endMoveTime!, timeZone)
          : toLocalDT(Date.now(), timeZone)
      );
    }
  }, [isManual, hasEndMoveTime, endMoveTime, timeZone, canManual]);

  const handleQuickStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasEndMoveTime) {
      await handleEndMove();
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManual || !hasEndMoveTime) {
      setIsEditing(false);
      return;
    }
    const newStart = fromLocalDT(startLocal, timeZone);
    if (newStart !== endMoveTime) {
      await Promise.resolve(handleSetEndMove!(newStart));
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setStartLocal(hasEndMoveTime ? toLocalDT(endMoveTime!, timeZone) : "");
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
    await handleSetEndMove!(newStart);
    setIsManual(false);
  };

  const handleManualCancel = () => {
    setIsManual(false);
    onCancel?.();
  };

  const showEditButton = hasEndMoveTime;

  const startValue =
    isEditing || isManual
      ? startLocal
      : hasEndMoveTime
        ? toLocalDT(endMoveTime!, timeZone)
        : "";
  const isCompleted = !!endMoveTime;

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
        End Move Time
      </Header3>

      <SectionContainer>
        {(hasEndMoveTime || isManual) && (
          <div className="mb-3">
            <LabeledDateTime
              label="End Time"
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
        ) : !hasEndMoveTime ? (
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

export default EndMoveSection;
