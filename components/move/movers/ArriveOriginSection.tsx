"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import FormActions from "@/components/shared/buttons/FormActions";
import LabeledDateTime from "../../shared/labeled/LabeledDateTime";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import { toLocalDT, fromLocalDT } from "@/frontendUtils/helper";

interface ArriveOriginSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  handleArriveOrigin: () => Promise<void> | void;
  handleSetArriveOrigin: (value: number) => Promise<void> | void;
  arriveOriginTime?: number | null;
  timeZone: string;
  hideButton?: boolean;
}

const ArriveOriginSection: React.FC<ArriveOriginSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleArriveOrigin,
  handleSetArriveOrigin,
  arriveOriginTime,
  timeZone,
  hideButton = false,
}) => {
  const hasArriveOriginTime = typeof arriveOriginTime === "number";
  const canManual = Boolean(handleSetArriveOrigin);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [startLocal, setStartLocal] = useState<string>("");

  useEffect(() => {
    if (isEditing && canManual) {
      setStartLocal(
        hasArriveOriginTime ? toLocalDT(arriveOriginTime!, timeZone) : ""
      );
    }
  }, [isEditing, hasArriveOriginTime, arriveOriginTime, timeZone, canManual]);

  useEffect(() => {
    if (isManual && canManual) {
      setStartLocal(
        hasArriveOriginTime
          ? toLocalDT(arriveOriginTime!, timeZone)
          : toLocalDT(Date.now(), timeZone)
      );
    }
  }, [isManual, hasArriveOriginTime, arriveOriginTime, timeZone, canManual]);

  const handleQuickStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasArriveOriginTime) {
      await handleArriveOrigin();
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManual || !hasArriveOriginTime) {
      setIsEditing(false);
      return;
    }
    const newStart = fromLocalDT(startLocal, timeZone);
    if (newStart !== arriveOriginTime) {
      await Promise.resolve(handleSetArriveOrigin!(newStart));
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setStartLocal(
      hasArriveOriginTime ? toLocalDT(arriveOriginTime!, timeZone) : ""
    );
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
    await handleSetArriveOrigin!(newStart);
    setIsManual(false);
  };

  const handleManualCancel = () => {
    setIsManual(false);
    onCancel?.();
  };

  const showEditButton = hasArriveOriginTime;

  const startValue =
    isEditing || isManual
      ? startLocal
      : hasArriveOriginTime
        ? toLocalDT(arriveOriginTime!, timeZone)
        : "";

  const isCompleted = !!arriveOriginTime;
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
        hideButton={hideButton}
      >
        Arrive Origin Time
      </Header3>

      <SectionContainer>
        {(hasArriveOriginTime || isManual) && (
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
        ) : !hasArriveOriginTime ? (
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

export default ArriveOriginSection;
