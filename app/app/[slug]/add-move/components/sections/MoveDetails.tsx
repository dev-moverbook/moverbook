import { useEffect, useState } from "react";
import LabeledDateInput from "@/app/components/shared/labeled/LabeledDateInput";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledTimeInput from "@/app/components/shared/labeled/LabeledTimeInput";
import TimeSlotSelector from "@/app/components/shared/labeled/TimeSlotSelector";
import Header2 from "@/app/components/shared/heading/Header2";
import {
  MoveTimes,
  SERVICE_TYPE_OPTIONS,
  ServiceType,
  START_WINDOW_OPTIONS,
  StartWindowOption,
} from "@/types/types";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { formatTime } from "@/app/frontendUtils/helper";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";

const MoveDetails = () => {
  const {
    moveFormData,
    setMoveFormData,
    moveFormErrors,
    setMoveFormErrors,
    arrivalWindowOptions,
    isLoading,
    isError,
    errorMessage,
    isMoveDetailsComplete,
  } = useMoveForm();

  const [startWindowOption, setStartWindowOption] = useState<StartWindowOption>(
    moveFormData.moveWindow === "custom" ? "custom" : "available"
  );

  useEffect(() => {
    if (startWindowOption === "custom") {
      setMoveFormData((prev) => ({
        ...prev,
        moveWindow: "custom",
      }));
    }
  }, [startWindowOption, setMoveFormData]);

  return (
    <>
      <Header2 isCompleted={isMoveDetailsComplete}>Move Details</Header2>
      <SectionContainer>
        <LabeledRadio
          label="Type of Service"
          name="serviceType"
          value={moveFormData.serviceType || ""}
          onChange={(value) => {
            setMoveFormData((prev) => ({
              ...prev,
              serviceType: value as ServiceType,
            }));
            if (moveFormErrors.serviceType) {
              const { serviceType, ...rest } = moveFormErrors;
              setMoveFormErrors(rest);
            }
          }}
          options={SERVICE_TYPE_OPTIONS}
          error={moveFormErrors.serviceType}
        />

        <LabeledDateInput
          label="Move Date"
          value={moveFormData.moveDate || ""}
          onChange={(e) => {
            setMoveFormData((prev) => ({
              ...prev,
              moveDate: e.target.value,
            }));
            if (moveFormErrors.moveDate) {
              const { moveDate, ...rest } = moveFormErrors;
              setMoveFormErrors(rest);
            }
          }}
          error={moveFormErrors.moveDate}
        />

        <LabeledRadio
          label="Start Window Option"
          name="startWindowOption"
          value={startWindowOption}
          onChange={(value) => setStartWindowOption(value as StartWindowOption)}
          options={START_WINDOW_OPTIONS}
        />

        {startWindowOption === "custom" && (
          <div className="flex gap-4">
            <LabeledTimeInput
              label="Arrival Time Begins"
              value={moveFormData.arrivalTimes?.arrivalWindowStarts || ""}
              onChange={(e) => {
                setMoveFormData((prev) => ({
                  ...prev,
                  arrivalTimes: {
                    ...prev.arrivalTimes,
                    arrivalWindowStarts: e.target.value,
                  },
                }));
                if (moveFormErrors.arrivalWindowStarts) {
                  const { arrivalWindowStarts, ...rest } = moveFormErrors;
                  setMoveFormErrors(rest);
                }
              }}
              error={moveFormErrors.arrivalWindowStarts}
            />
            <LabeledTimeInput
              label="Arrival Time Ends"
              value={moveFormData.arrivalTimes?.arrivalWindowEnds || ""}
              onChange={(e) => {
                setMoveFormData((prev) => ({
                  ...prev,
                  arrivalTimes: {
                    ...prev.arrivalTimes,
                    arrivalWindowEnds: e.target.value,
                  },
                }));
                if (moveFormErrors.arrivalWindowEnds) {
                  const { arrivalWindowEnds, ...rest } = moveFormErrors;
                  setMoveFormErrors(rest);
                }
              }}
              error={moveFormErrors.arrivalWindowEnds}
            />
          </div>
        )}

        {startWindowOption === "available" && (
          <TimeSlotSelector
            value={
              moveFormData.arrivalTimes
                ? JSON.stringify({
                    arrivalWindowStarts:
                      moveFormData.arrivalTimes.arrivalWindowStarts,
                    arrivalWindowEnds:
                      moveFormData.arrivalTimes.arrivalWindowEnds,
                  })
                : ""
            }
            onChange={(val) => {
              try {
                const parsed = JSON.parse(val);

                setMoveFormData((prev) => {
                  let moveWindow: MoveTimes = "custom";
                  if (
                    parsed.arrivalWindowStarts ===
                      arrivalWindowOptions?.morningArrival &&
                    parsed.arrivalWindowEnds ===
                      arrivalWindowOptions?.morningEnd
                  ) {
                    moveWindow = "morning";
                  } else if (
                    parsed.arrivalWindowStarts ===
                      arrivalWindowOptions?.afternoonArrival &&
                    parsed.arrivalWindowEnds ===
                      arrivalWindowOptions?.afternoonEnd
                  ) {
                    moveWindow = "afternoon";
                  }

                  return {
                    ...prev,
                    arrivalTimes: {
                      arrivalWindowStarts: parsed.arrivalWindowStarts,
                      arrivalWindowEnds: parsed.arrivalWindowEnds,
                    },
                    moveWindow,
                  };
                });
              } catch {
                setMoveFormData((prev) => ({
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
              arrivalWindowOptions
                ? [
                    {
                      label: `${formatTime(arrivalWindowOptions.morningArrival)} - ${formatTime(arrivalWindowOptions.morningEnd)}`,
                      value: JSON.stringify({
                        arrivalWindowStarts:
                          arrivalWindowOptions.morningArrival,
                        arrivalWindowEnds: arrivalWindowOptions.morningEnd,
                      }),
                    },
                    {
                      label: `${formatTime(arrivalWindowOptions.afternoonArrival)} - ${formatTime(arrivalWindowOptions.afternoonEnd)}`,
                      value: JSON.stringify({
                        arrivalWindowStarts:
                          arrivalWindowOptions.afternoonArrival,
                        arrivalWindowEnds: arrivalWindowOptions.afternoonEnd,
                      }),
                    },
                  ]
                : null
            }
            isLoading={isLoading}
            isError={isError}
            error={errorMessage}
          />
        )}
      </SectionContainer>
    </>
  );
};

export default MoveDetails;
