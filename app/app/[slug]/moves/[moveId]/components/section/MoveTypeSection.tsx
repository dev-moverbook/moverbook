"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import FormActions from "@/app/components/shared/FormActions";
import {
  SERVICE_TYPE_OPTIONS,
  ServiceType,
  START_WINDOW_OPTIONS,
  StartWindowOption,
} from "@/types/types";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { MoveTypeFormData } from "@/types/form-types";
import { cn } from "@/lib/utils";
import { ContactValidationErrors } from "@/app/frontendUtils/validation";
import LabeledDateInput from "@/app/components/shared/labeled/LabeledDateInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledTimeInput from "@/app/components/shared/labeled/LabeledTimeInput";
import TimeSlotSelector from "@/app/components/shared/labeled/TimeSlotSelector";
import { useCompanyArrivalResult } from "@/app/hooks/queries/useCompanyArrivalResult";
import { formatTime } from "@/app/frontendUtils/helper";
import { useMoveContext } from "@/app/contexts/MoveContext";

interface MoveTypeSectionProps {}

const MoveTypeSection = ({}: MoveTypeSectionProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [startWindowOption, setStartWindowOption] = useState<StartWindowOption>(
    move.moveWindow === "custom" ? "custom" : "available"
  );

  const { arrivalWindow, isLoading, isError, errorMessage } =
    useCompanyArrivalResult(move.companyId);
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [formData, setFormData] = useState<MoveTypeFormData>({
    serviceType: move.serviceType,
    moveDate: move.moveDate,
    moveWindow: move.moveWindow,
    arrivalTimes: {
      arrivalWindowStarts: move.arrivalTimes.arrivalWindowStarts,
      arrivalWindowEnds: move.arrivalTimes.arrivalWindowEnds,
    },
  });

  const [errors, setErrors] = useState<ContactValidationErrors>({});

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // const { isValid, errors } = validateContactForm(formData, referralValues);
    // if (!isValid) {
    //   setErrors(errors);
    //   return;
    // }

    await updateMove({ moveId: move._id, updates: formData });
    setIsEditing(false);
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
    setIsEditing(false);
  };

  const isCompleted =
    !!formData.serviceType?.trim() &&
    !!formData.moveDate?.trim() &&
    !!formData.moveWindow?.trim() &&
    !!formData.arrivalTimes.arrivalWindowStarts?.trim() &&
    !!formData.arrivalTimes.arrivalWindowEnds?.trim();

  return (
    <div>
      <SectionHeader
        title="Move Type"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancel}
        className="pb-0 mx-auto"
        isCompleted={isCompleted}
        showCheckmark={true}
      />
      <SectionContainer className={cn("", isEditing && "gap-0")}>
        <LabeledRadio
          label="Service Type"
          name="serviceType"
          value={formData.serviceType || ""}
          options={SERVICE_TYPE_OPTIONS}
          isEditing={isEditing}
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              serviceType: val as ServiceType,
            }))
          }
        />

        <LabeledDateInput
          label="Move Date"
          value={formData.moveDate || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, moveDate: e.target.value }))
          }
          isEditing={isEditing}
        />

        {isEditing && (
          <LabeledRadio
            label="Start Window Option"
            name="startWindow"
            value={startWindowOption}
            options={START_WINDOW_OPTIONS}
            isEditing={isEditing}
            onChange={(val) => setStartWindowOption(val as StartWindowOption)}
          />
        )}

        {startWindowOption === "custom" && (
          <div className="flex gap-4">
            <LabeledTimeInput
              label="Arrival Time Begins"
              value={formData.arrivalTimes.arrivalWindowStarts || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  arrivalTimes: {
                    arrivalWindowStarts: e.target.value,
                    arrivalWindowEnds: prev.arrivalTimes.arrivalWindowEnds,
                  },
                }));
                setErrors((prev) => ({ ...prev, arrivalWindow: null }));
              }}
              isEditing={isEditing}
            />

            <LabeledTimeInput
              label="Arrival Time Ends"
              value={formData.arrivalTimes.arrivalWindowEnds || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  arrivalTimes: {
                    arrivalWindowStarts: prev.arrivalTimes.arrivalWindowStarts,
                    arrivalWindowEnds: e.target.value,
                  },
                }));
                setErrors((prev) => ({ ...prev, arrivalWindow: null }));
              }}
              isEditing={isEditing}
            />
          </div>
        )}
        {startWindowOption === "available" && arrivalWindow && (
          <TimeSlotSelector
            value={JSON.stringify(formData.arrivalTimes)}
            onChange={(val) => {
              try {
                const parsed = JSON.parse(val);
                setFormData((prev) => ({
                  ...prev,
                  arrivalTimes: {
                    arrivalWindowStarts: parsed.arrivalWindowStarts,
                    arrivalWindowEnds: parsed.arrivalWindowEnds,
                  },
                  moveWindow:
                    parsed.arrivalWindowStarts ===
                      arrivalWindow.morningArrival &&
                    parsed.arrivalWindowEnds === arrivalWindow.morningEnd
                      ? "morning"
                      : parsed.arrivalWindowStarts ===
                            arrivalWindow.afternoonArrival &&
                          parsed.arrivalWindowEnds ===
                            arrivalWindow.afternoonEnd
                        ? "afternoon"
                        : "custom",
                }));
                setErrors((prev) => ({ ...prev, arrivalWindow: null }));
              } catch {
                setFormData((prev) => ({
                  ...prev,
                  arrivalTimes: {
                    arrivalWindowStarts: "",
                    arrivalWindowEnds: "",
                  },
                  moveWindow: "custom",
                }));
              }
            }}
            options={
              arrivalWindow
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
                : null
            }
            isEditing={isEditing}
            isLoading={isLoading}
            isError={isError}
            fetchErrorMessage={errorMessage}
          />
        )}

        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={updateMoveLoading}
            error={updateMoveError}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveTypeSection;
