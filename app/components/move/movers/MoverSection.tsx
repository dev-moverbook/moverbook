"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import FormActions from "../../shared/FormActions";
import LabeledDateTime from "../../shared/labeled/LabeledDateTime";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import { Doc } from "@/convex/_generated/dataModel";
import { DateTime } from "luxon";
import CounterInput from "../../shared/labeled/CounterInput";
import { Label } from "@/components/ui/label";

interface MoverSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  handleStartTimeChange: (value: number) => Promise<void> | void;
  handleEndTimeChange: (value: number) => Promise<void> | void;
  assignment: Doc<"moveAssignments">;
  timeZone: string;
  breakMoveTime?: number;
  handleChangeBreakTime: (value: number) => Promise<void> | void;
}

type ManualTarget = "start" | "end" | null;

const toLocalDT = (ms: number, zone: string) =>
  DateTime.fromMillis(ms, { zone }).toFormat("yyyy-LL-dd'T'HH:mm");

const fromLocalDT = (val: string, zone: string) =>
  DateTime.fromISO(val, { zone }).toMillis();

const MoverSection: React.FC<MoverSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleStartTimeChange,
  handleEndTimeChange,
  assignment,
  timeZone,
  breakMoveTime,
  handleChangeBreakTime,
}) => {
  const startTime = assignment.startTime;
  const endTime = assignment.endTime;

  const hasStartTime = typeof startTime === "number";
  const hasEndTime = typeof endTime === "number";

  const canStart = !hasStartTime;
  const canEnd = hasStartTime && !hasEndTime;

  const [isEditing, setIsEditing] = useState(false);
  const [manualTarget, setManualTarget] = useState<ManualTarget>(null);

  const [startLocal, setStartLocal] = useState<string>("");
  const [endLocal, setEndLocal] = useState<string>("");

  useEffect(() => {
    if (isEditing) {
      setStartLocal(hasStartTime ? toLocalDT(startTime!, timeZone) : "");
      setEndLocal(hasEndTime ? toLocalDT(endTime!, timeZone) : "");
    }
  }, [isEditing, hasStartTime, hasEndTime, startTime, endTime, timeZone]);

  useEffect(() => {
    if (manualTarget === "start") {
      setStartLocal(
        hasStartTime
          ? toLocalDT(startTime!, timeZone)
          : toLocalDT(Date.now(), timeZone)
      );
    } else if (manualTarget === "end") {
      setEndLocal(
        hasEndTime
          ? toLocalDT(endTime!, timeZone)
          : toLocalDT(Date.now(), timeZone)
      );
    }
  }, [manualTarget, hasStartTime, hasEndTime, startTime, endTime, timeZone]);

  const saveLabel = canStart ? "Start" : "End";

  const handleQuickAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (canStart) await handleStartTimeChange(now);
    else if (canEnd) await handleEndTimeChange(now);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const promises: Promise<any>[] = [];
    if (hasStartTime) {
      const newStart = fromLocalDT(startLocal, timeZone);
      if (newStart !== startTime)
        promises.push(Promise.resolve(handleStartTimeChange(newStart)));
    }
    if (hasEndTime) {
      const newEnd = fromLocalDT(endLocal, timeZone);
      if (newEnd !== endTime)
        promises.push(Promise.resolve(handleEndTimeChange(newEnd)));
    }
    await Promise.all(promises);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setStartLocal(hasStartTime ? toLocalDT(startTime!, timeZone) : "");
    setEndLocal(hasEndTime ? toLocalDT(endTime!, timeZone) : "");
    setIsEditing(false);
    onCancel?.();
  };

  const beginManualEntry = () => {
    setIsEditing(false);
    setManualTarget(canStart ? "start" : "end");
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualTarget === "start") {
      const newStart = fromLocalDT(startLocal, timeZone);
      await handleStartTimeChange(newStart);
    } else if (manualTarget === "end") {
      const newEnd = fromLocalDT(endLocal, timeZone);
      await handleEndTimeChange(newEnd);
    }
    setManualTarget(null);
  };

  const handleManualCancel = () => {
    setManualTarget(null);
    onCancel?.();
  };

  const showEditButton =
    assignment.hourStatus !== "approved" &&
    (hasStartTime || hasEndTime) &&
    !manualTarget;

  const startValue =
    isEditing || manualTarget === "start"
      ? startLocal
      : hasStartTime
        ? toLocalDT(startTime!, timeZone)
        : "";

  const endValue =
    isEditing || manualTarget === "end"
      ? endLocal
      : hasEndTime
        ? toLocalDT(endTime!, timeZone)
        : "";

  const statusKey = (assignment.hourStatus ?? "").toString().toLowerCase();
  const statusLabelMap = {
    pending: "Pending Hours Approval",
    rejected: "Hours Rejected",
    approved: "Hours Approved",
  } as const;
  const statusColorMap = {
    pending: "text-yellow-400",
    rejected: "text-red-400",
    approved: "text-green-400",
  } as const;
  const statusLabel =
    statusLabelMap[statusKey as keyof typeof statusLabelMap] ?? "";
  const statusColor =
    statusColorMap[statusKey as keyof typeof statusColorMap] ?? "text-gray-400";

  return (
    <div>
      <Header3
        button={
          showEditButton && (
            <EditToggleButton
              isEditing={isEditing}
              onToggle={() => setIsEditing((v) => !v)}
            />
          )
        }
      >
        Work Hours
      </Header3>

      <SectionContainer>
        {(hasStartTime || manualTarget === "start") && (
          <div className="mb-3">
            <LabeledDateTime
              label="Start Time"
              value={startValue}
              onChange={(e) => setStartLocal(e.target.value)}
              isEditing={isEditing || manualTarget === "start"}
            />
          </div>
        )}

        {(hasEndTime || manualTarget === "end") && (
          <div className="mb-3">
            <LabeledDateTime
              label="End Time"
              value={endValue}
              onChange={(e) => setEndLocal(e.target.value)}
              isEditing={isEditing || manualTarget === "end"}
            />
          </div>
        )}

        <div>
          <Label>Break Time</Label>
          <div className="flex gap-12">
            <CounterInput
              label="Hours"
              value={breakMoveTime ?? 0}
              onChange={(value) => handleChangeBreakTime(value)}
              min={0}
            />
            <CounterInput
              label="Minutes"
              value={breakMoveTime ?? 0}
              onChange={(value) => handleChangeBreakTime(value)}
              min={0}
              max={59}
            />
          </div>
        </div>

        {isEditing ? (
          <FormActions
            onSave={(e) => void handleEditSave(e)}
            onCancel={handleEditCancel}
            isSaving={isSaving}
            error={updateError}
            saveLabel="Save"
            cancelLabel="Cancel"
          />
        ) : manualTarget ? (
          <FormActions
            onSave={(e) => void handleManualSave(e)}
            onCancel={handleManualCancel}
            isSaving={isSaving}
            error={updateError}
            saveLabel="Save"
            cancelLabel="Cancel"
          />
        ) : canStart || canEnd ? (
          <FormActions
            onSave={(e) => void handleQuickAction(e)}
            onCancel={beginManualEntry}
            isSaving={isSaving}
            error={updateError}
            saveLabel={saveLabel}
            cancelLabel="Enter Time"
          />
        ) : null}

        {statusLabel && (
          <div className={`mt-4 text-sm font-medium ${statusColor}`}>
            {statusLabel}
          </div>
        )}
      </SectionContainer>
    </div>
  );
};

export default MoverSection;
