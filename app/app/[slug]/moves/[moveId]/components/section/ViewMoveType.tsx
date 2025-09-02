"use client";

import React, { useState } from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { ServiceType, StartWindowOption } from "@/types/types";
import { MoveTypeFormData } from "@/types/form-types";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyArrival } from "@/app/hooks/queries/useCompanyArrivalResult";
import { QueryStatus, ClerkRoles } from "@/types/enums";
import { formatTime } from "@/app/frontendUtils/helper";
import { canCreateMove, isMover } from "@/app/frontendUtils/permissions";
import { useSlugContext } from "@/app/contexts/SlugContext";
import MoveTypeSection from "@/app/components/move/sections/MoveTypeSection";

const ViewMoveType: React.FC = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { user } = useSlugContext();
  const canCreateMoveUser = canCreateMove(
    user.publicMetadata.role as ClerkRoles
  );
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [startWindowOption, setStartWindowOption] = useState<StartWindowOption>(
    move.moveWindow === "custom" ? "custom" : "available"
  );

  const [formData, setFormData] = useState<MoveTypeFormData>({
    serviceType: move.serviceType,
    moveDate: move.moveDate,
    moveWindow: move.moveWindow,
    arrivalTimes: {
      arrivalWindowStarts: move.arrivalTimes.arrivalWindowStarts,
      arrivalWindowEnds: move.arrivalTimes.arrivalWindowEnds,
    },
  });

  // Fetch company arrival windows (used to build selectable “available” slots)
  const arrivalRes = useCompanyArrival(move.companyId, {
    enabled: !isMoverUser,
  });
  const arrivalWindow =
    arrivalRes.status === QueryStatus.SUCCESS ? arrivalRes.arrivalWindow : null;

  const timeSlotOptions = arrivalWindow
    ? [
        {
          label: `${formatTime(arrivalWindow.morningArrival)} - ${formatTime(arrivalWindow.morningEnd)}`,
          value: JSON.stringify({
            arrivalWindowStarts: arrivalWindow.morningArrival,
            arrivalWindowEnds: arrivalWindow.morningEnd,
          }),
        },
        {
          label: `${formatTime(arrivalWindow.afternoonArrival)} - ${formatTime(arrivalWindow.afternoonEnd)}`,
          value: JSON.stringify({
            arrivalWindowStarts: arrivalWindow.afternoonArrival,
            arrivalWindowEnds: arrivalWindow.afternoonEnd,
          }),
        },
      ]
    : null;

  const handleSave = async () => {
    const { success } = await updateMove({
      moveId: move._id,
      updates: {
        serviceType: formData.serviceType,
        moveDate: formData.moveDate,
        moveWindow: formData.moveWindow,
        arrivalTimes: {
          arrivalWindowStarts: formData.arrivalTimes.arrivalWindowStarts,
          arrivalWindowEnds: formData.arrivalTimes.arrivalWindowEnds,
        },
      },
    });
    if (success) setIsEditing(false);
    return success;
  };

  const handleCancel = () => {
    setFormData({
      serviceType: move.serviceType,
      moveDate: move.moveDate,
      moveWindow: move.moveWindow,
      arrivalTimes: {
        arrivalWindowStarts: move.arrivalTimes.arrivalWindowStarts,
        arrivalWindowEnds: move.arrivalTimes.arrivalWindowEnds,
      },
    });
    setStartWindowOption(move.moveWindow === "custom" ? "custom" : "available");
    setIsEditing(false);
  };

  const handleServiceTypeChange = (val: ServiceType) => {
    setFormData((prev) => ({ ...prev, serviceType: val }));
  };

  const handleMoveDateChange = (val: string) => {
    setFormData((prev) => ({ ...prev, moveDate: val }));
  };

  const handleStartWindowOptionChange = (val: StartWindowOption) => {
    setStartWindowOption(val);
    if (val === "custom") {
      // When switching to custom, keep current times but force moveWindow to "custom"
      setFormData((prev) => ({ ...prev, moveWindow: "custom" }));
    } else if (val === "available" && arrivalWindow) {
      // If switching to available without picking a slot yet, clear to avoid stale custom values
      setFormData((prev) => ({
        ...prev,
        arrivalTimes: {
          arrivalWindowStarts: "",
          arrivalWindowEnds: "",
        },
      }));
    }
  };

  const handleArrivalStartChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      arrivalTimes: {
        arrivalWindowStarts: val,
        arrivalWindowEnds: prev.arrivalTimes.arrivalWindowEnds,
      },
    }));
  };

  const handleArrivalEndChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      arrivalTimes: {
        arrivalWindowStarts: prev.arrivalTimes.arrivalWindowStarts,
        arrivalWindowEnds: val,
      },
    }));
  };

  // Called when selecting one of the “available” time slots
  const handleSelectTimeSlot = (value: string) => {
    try {
      const parsed = JSON.parse(value) as {
        arrivalWindowStarts: string;
        arrivalWindowEnds: string;
      };

      // Determine moveWindow based on which slot was chosen
      let nextWindow: "morning" | "afternoon" | "custom" = "custom";
      if (arrivalWindow) {
        const isMorning =
          parsed.arrivalWindowStarts === arrivalWindow.morningArrival &&
          parsed.arrivalWindowEnds === arrivalWindow.morningEnd;
        const isAfternoon =
          parsed.arrivalWindowStarts === arrivalWindow.afternoonArrival &&
          parsed.arrivalWindowEnds === arrivalWindow.afternoonEnd;

        nextWindow = isMorning
          ? "morning"
          : isAfternoon
            ? "afternoon"
            : "custom";
      }

      setFormData((prev) => ({
        ...prev,
        arrivalTimes: {
          arrivalWindowStarts: parsed.arrivalWindowStarts,
          arrivalWindowEnds: parsed.arrivalWindowEnds,
        },
        moveWindow: nextWindow,
      }));
    } catch {
      // Fallback to custom if parsing fails
      setFormData((prev) => ({
        ...prev,
        arrivalTimes: { arrivalWindowStarts: "", arrivalWindowEnds: "" },
        moveWindow: "custom",
      }));
    }
  };

  return (
    <MoveTypeSection
      serviceType={formData.serviceType}
      moveDate={formData.moveDate}
      startWindowOption={startWindowOption}
      moveWindow={formData.moveWindow}
      arrivalTimes={formData.arrivalTimes}
      timeSlotOptions={timeSlotOptions}
      timeSlotsLoading={arrivalRes.status === QueryStatus.LOADING}
      timeSlotsError={
        arrivalRes.status === QueryStatus.ERROR ? arrivalRes.errorMessage : null
      }
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={updateMoveLoading}
      updateError={updateMoveError}
      onServiceTypeChange={handleServiceTypeChange}
      onMoveDateChange={handleMoveDateChange}
      onStartWindowOptionChange={handleStartWindowOptionChange}
      onArrivalStartChange={handleArrivalStartChange}
      onArrivalEndChange={handleArrivalEndChange}
      onSelectTimeSlot={handleSelectTimeSlot}
      canEdit={canCreateMoveUser}
    />
  );
};

export default ViewMoveType;
