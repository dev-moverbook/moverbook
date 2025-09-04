"use client";

import React, { useEffect, useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import { Doc } from "@/convex/_generated/dataModel";
import PayOutCard from "./PayOutCard";
import { MoverWageForMove } from "@/convex/backendUtils/queryHelpers";
import {
  splitDecimalHours,
  combineToDecimalHours,
  clamp,
} from "@/app/frontendUtils/timeUtils";
import {
  toLocalDateTime,
  fromLocalDateTime,
} from "@/app/frontendUtils/luxonUtils";
import MoverSectionContent from "./MoverSectionContent";

interface MoverSectionProps {
  isSaving?: boolean;
  updateError?: string | null;
  onCancel?: () => void;
  handleStartTimeChange: (value: number) => Promise<void> | void;
  handleEndTimeChange: (value: number) => Promise<void> | void;
  assignment: Doc<"moveAssignments">;
  timeZone: string;
  wageDisplay: MoverWageForMove | null;
  breakHours?: number;
  handleChangeBreakTime: (hoursDecimal: number) => Promise<void> | void;
}

type ManualTarget = "start" | "end" | null;

const MoverSection: React.FC<MoverSectionProps> = ({
  isSaving = false,
  updateError,
  onCancel,
  handleStartTimeChange,
  handleEndTimeChange,
  assignment,
  timeZone,
  breakHours = 0,
  handleChangeBreakTime,
  wageDisplay,
}) => {
  const startTime = assignment.startTime;
  const endTime = assignment.endTime;

  const hasStartTime = typeof startTime === "number";
  const hasEndTime = typeof endTime === "number";

  const isCompleted = hasStartTime && hasEndTime;
  const canStart = !hasStartTime;
  const canEnd = hasStartTime && !hasEndTime;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [manualTarget, setManualTarget] = useState<ManualTarget>(null);

  const [startLocal, setStartLocal] = useState<string>("");
  const [endLocal, setEndLocal] = useState<string>("");

  const { hours: serverBreakHours, minutes: serverBreakMinutes } =
    splitDecimalHours(breakHours);

  const [breakHoursLocal, setBreakHoursLocal] =
    useState<number>(serverBreakHours);
  const [breakMinutesLocal, setBreakMinutesLocal] =
    useState<number>(serverBreakMinutes);

  useEffect(() => {
    if (isEditing) {
      setStartLocal(hasStartTime ? toLocalDateTime(startTime!, timeZone) : "");
      setEndLocal(hasEndTime ? toLocalDateTime(endTime!, timeZone) : "");

      setBreakHoursLocal(serverBreakHours);
      setBreakMinutesLocal(serverBreakMinutes);
    }
  }, [isEditing, hasStartTime, hasEndTime, startTime, endTime, timeZone]);

  useEffect(() => {
    if (manualTarget === "start") {
      setStartLocal(
        hasStartTime
          ? toLocalDateTime(startTime!, timeZone)
          : toLocalDateTime(Date.now(), timeZone)
      );
    } else if (manualTarget === "end") {
      setEndLocal(
        hasEndTime
          ? toLocalDateTime(endTime!, timeZone)
          : toLocalDateTime(Date.now(), timeZone)
      );
    }
  }, [manualTarget, hasStartTime, hasEndTime, startTime, endTime, timeZone]);

  const saveLabel = canStart ? "Start" : "End";

  const handleQuickAction = async (event: React.FormEvent) => {
    event.preventDefault();
    const nowMillis = Date.now();
    if (canStart) {
      await handleStartTimeChange(nowMillis);
    }
    if (canEnd) {
      await handleEndTimeChange(nowMillis);
    }
  };

  const handleEditSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const pendingUpdates: Promise<unknown>[] = [];

    if (hasStartTime) {
      const newStartMillis = fromLocalDateTime(startLocal, timeZone);
      if (newStartMillis !== startTime) {
        const promise = handleStartTimeChange(newStartMillis);
        if (promise) {
          pendingUpdates.push(promise);
        }
      }
    }
    if (hasEndTime) {
      const newEndMillis = fromLocalDateTime(endLocal, timeZone);
      if (newEndMillis !== endTime) {
        const promise = handleEndTimeChange(newEndMillis);
        if (promise) {
          pendingUpdates.push(promise);
        }
      }
    }

    const newBreakDecimal = combineToDecimalHours(
      Math.max(0, breakHoursLocal),
      clamp(Math.round(breakMinutesLocal), 0, 59)
    );
    if (newBreakDecimal !== breakHours) {
      const promise = handleChangeBreakTime(newBreakDecimal);
      if (promise) {
        pendingUpdates.push(promise);
      }
    }

    await Promise.all(pendingUpdates);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setStartLocal(hasStartTime ? toLocalDateTime(startTime!, timeZone) : "");
    setEndLocal(hasEndTime ? toLocalDateTime(endTime!, timeZone) : "");
    // reset local break edits to server values
    setBreakHoursLocal(serverBreakHours);
    setBreakMinutesLocal(serverBreakMinutes);

    setIsEditing(false);
    onCancel?.();
  };

  const beginManualEntry = () => {
    setIsEditing(false);
    setManualTarget(canStart ? "start" : "end");
  };

  const handleManualSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (manualTarget === "start") {
      await handleStartTimeChange(fromLocalDateTime(startLocal, timeZone));
    } else if (manualTarget === "end") {
      await handleEndTimeChange(fromLocalDateTime(endLocal, timeZone));
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
        ? toLocalDateTime(startTime!, timeZone)
        : "";

  const endValue =
    isEditing || manualTarget === "end"
      ? endLocal
      : hasEndTime
        ? toLocalDateTime(endTime!, timeZone)
        : "";

  const handleBreakHoursLocalChange = (newHoursWhole: number) => {
    setBreakHoursLocal(Math.max(0, newHoursWhole));
  };

  const handleBreakMinutesLocalChange = (newMinutesWhole: number) => {
    setBreakMinutesLocal(clamp(Math.round(newMinutesWhole), 0, 59));
  };

  return (
    <div className="pb-20">
      <Header3
        isCompleted={isCompleted}
        button={
          showEditButton && (
            <EditToggleButton
              isEditing={isEditing}
              onToggle={() => setIsEditing((prev) => !prev)}
            />
          )
        }
      >
        Work Hours
      </Header3>

      <SectionContainer showBorder={false}>
        <MoverSectionContent
          hasStartTime={hasStartTime}
          hasEndTime={hasEndTime}
          isEditing={isEditing}
          manualTarget={manualTarget}
          startValue={startValue}
          endValue={endValue}
          onStartChange={setStartLocal}
          onEndChange={setEndLocal}
          isSaving={isSaving}
          updateError={updateError}
          saveLabel={saveLabel}
          canStart={canStart}
          canEnd={canEnd}
          onQuickAction={handleQuickAction}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
          onManualSave={handleManualSave}
          onManualCancel={handleManualCancel}
          beginManualEntry={beginManualEntry}
          breakHours={breakHoursLocal}
          breakMinutes={breakMinutesLocal}
          onBreakHoursChange={handleBreakHoursLocalChange}
          onBreakMinutesChange={handleBreakMinutesLocalChange}
        />

        {isCompleted && (
          <PayOutCard moveAssignment={assignment} wageDisplay={wageDisplay} />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoverSection;
