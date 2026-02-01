"use client";

import { useState } from "react";
import { useMoveContext } from "@/contexts/MoveContext";
import { ServiceType, StartWindowOption } from "@/types/types";
import { MoveTypeFormData } from "@/types/form-types";
import { useUpdateMove } from "@/hooks/moves";
import { useCompanyArrival } from "@/hooks/arrivalWindows/useCompanyArrivalResult";
import { formatTime } from "@/frontendUtils/helper";
import { canCreateMove, isMover } from "@/frontendUtils/permissions";
import { useSlugContext } from "@/contexts/SlugContext";
import MoveTypeSection from "@/components/move/sections/MoveTypeSection";
import { isMoveCompleted } from "@/frontendUtils/moveHelper";

const ViewMoveType: React.FC = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { user } = useSlugContext();
  const canCreateMoveUser = canCreateMove(user?.role) && !isMoveCompleted(move);
  const isMoverUser = isMover(user?.role);

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [startWindowOption, setStartWindowOption] = useState<StartWindowOption>(
    move.moveWindow === "custom" ? "custom" : "available"
  );

  const [formData, setFormData] = useState<MoveTypeFormData>({
    serviceType: move.serviceType,
    moveDate: move.moveDate ?? null,
    moveWindow: move.moveWindow ?? "morning",
    arrivalTimes: {
      arrivalWindowStarts: move.arrivalTimes?.arrivalWindowStarts ?? null,
      arrivalWindowEnds: move.arrivalTimes?.arrivalWindowEnds ?? null,
    },
  });

  const arrivalRes = useCompanyArrival(move.companyId, {
    enabled: !isMoverUser,
  });
  const arrivalWindow = arrivalRes ? arrivalRes : null;

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
    const success = await updateMove({
      moveId: move._id,
      updates: {
        serviceType: formData.serviceType,
        moveDate: formData.moveDate,
        moveWindow: formData.moveWindow,
        arrivalTimes: {
          arrivalWindowStarts: formData.arrivalTimes.arrivalWindowStarts || "",
          arrivalWindowEnds: formData.arrivalTimes.arrivalWindowEnds || "",
        },
      },
    });
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  const handleCancel = () => {
    setFormData({
      serviceType: move.serviceType,
      moveDate: move.moveDate ?? null,
      moveWindow: move.moveWindow ?? "morning",
      arrivalTimes: {
        arrivalWindowStarts: move.arrivalTimes?.arrivalWindowStarts ?? null,
        arrivalWindowEnds: move.arrivalTimes?.arrivalWindowEnds ?? null,
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
      setFormData((prev) => ({ ...prev, moveWindow: "custom" }));
    } else if (val === "available" && arrivalWindow) {
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

  const handleSelectTimeSlot = (value: string) => {
    try {
      const parsed = JSON.parse(value) as {
        arrivalWindowStarts: string;
        arrivalWindowEnds: string;
      };

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
      arrivalTimes={formData.arrivalTimes}
      timeSlotOptions={timeSlotOptions}
      timeSlotsLoading={arrivalRes ? false : true}
      timeSlotsError={
        arrivalRes ? null : "Failed to load company arrival window."
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
