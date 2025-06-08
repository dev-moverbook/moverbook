"use client";

import FormContainer from "@/app/components/shared/containers/FormContainer";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import React, { useEffect, useState } from "react";
import Header2 from "@/app/components/shared/heading/Header2";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledDateInput from "@/app/components/shared/labeled/LabeledDateInput";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import FormActions from "@/app/components/shared/FormActions";
import TimeSlotSelector from "@/app/components/shared/labeled/TimeSlotSelector";
import LabeledTimeInput from "@/app/components/shared/labeled/LabeledTimeInput";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import {
  SERVICE_TYPE_OPTIONS,
  ServiceType,
  START_WINDOW_OPTIONS,
  StartWindowOption,
} from "@/types/types";
import { formatTime } from "@/app/frontendUtils/helper";

interface InfoStepProps {
  onNext: () => void;
  onCancel: () => void;
}

const InfoStep = ({ onNext, onCancel }: InfoStepProps) => {
  const {
    name,
    setName,
    nameError,
    setNameError,
    email,
    setEmail,
    emailError,
    setEmailError,
    phoneNumber,
    setPhoneNumber,
    phoneNumberError,
    setPhoneNumberError,
    alternatePhoneNumber,
    setAlternatePhoneNumber,
    alternatePhoneNumberError,
    setAlternatePhoneNumberError,
    serviceType,
    setServiceType,
    serviceTypeError,
    setServiceTypeError,
    moveDate,
    setMoveDate,
    moveDateError,
    setMoveDateError,
    referralSource,
    setReferralSource,
    referralSourceError,
    setReferralSourceError,
    arrivalWindow,
    setArrivalWindow,
    arrivalWindowError,
    setArrivalWindowError,
    referralOptions,
    isLoading,
    isError,
    errorMessage,
    arrivalWindowOptions,
    setMoveWindow,
    isInfoSectionComplete,
  } = useMoveForm();

  const [startWindowOption, setStartWindowOption] =
    useState<StartWindowOption>("available");

  useEffect(() => {
    if (startWindowOption === "custom") {
      setMoveWindow("custom");
    }
  }, [startWindowOption]);

  const referralSelectOptions =
    referralOptions?.map((r) => ({ label: r.name, value: r.name })) ?? [];

  const validateInfoStep = (e: React.FormEvent): void => {
    let isValid = true;
    if (!name.trim()) {
      setNameError("Full name is required");
      isValid = false;
    }

    if (isValid) {
      onNext();
    } else {
      e.preventDefault();
    }
  };

  return (
    <FormContainer>
      <Header2 isCompleted={isInfoSectionComplete}>Information</Header2>
      <div className="px-4 md:px-0 mt-4 md:mt-0">
        <LabeledInput
          label="Full Name*"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(null);
          }}
          placeholder="Enter full name"
          error={nameError}
        />
        <LabeledInput
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
          }}
          placeholder="Enter email"
          error={emailError}
        />
        <LabeledInput
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            setPhoneNumberError(null);
          }}
          placeholder="Enter phone number"
          error={phoneNumberError}
        />
        <LabeledInput
          label="Alternate Phone Number"
          value={alternatePhoneNumber}
          onChange={(e) => {
            setAlternatePhoneNumber(e.target.value);
            setAlternatePhoneNumberError(null);
          }}
          placeholder="Enter phone number"
          error={alternatePhoneNumberError}
        />
        <LabeledRadio
          label="Type of Service"
          name="serviceType"
          value={serviceType || ""}
          onChange={(value) => {
            setServiceType(value as ServiceType);
            setServiceTypeError(null);
          }}
          options={SERVICE_TYPE_OPTIONS}
          error={serviceTypeError}
        />
        <LabeledSelect
          label="Referral Source"
          value={referralSource}
          onChange={(value) => {
            setReferralSource(value === "none" ? null : value);
            setReferralSourceError(null);
          }}
          options={[...referralSelectOptions, { label: "None", value: "none" }]}
          loading={isLoading}
          queryError={errorMessage}
          placeholder="Select a referral source"
          error={referralSourceError}
        />

        <LabeledDateInput
          label="Move Date"
          value={moveDate || ""}
          onChange={(e) => {
            setMoveDate(e.target.value);
            setMoveDateError(null);
          }}
          error={moveDateError}
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
              value={arrivalWindow?.arrivalWindowStarts || ""}
              onChange={(e) => {
                setArrivalWindow({
                  arrivalWindowStarts: e.target.value,
                  arrivalWindowEnds: arrivalWindow.arrivalWindowEnds,
                });
                setArrivalWindowError(null);
              }}
              error={arrivalWindowError}
            />
            <LabeledTimeInput
              label="Arrival Time Ends"
              value={arrivalWindow?.arrivalWindowEnds || ""}
              onChange={(e) => {
                setArrivalWindow({
                  arrivalWindowStarts: arrivalWindow.arrivalWindowStarts,
                  arrivalWindowEnds: e.target.value,
                });
                setArrivalWindowError(null);
              }}
              error={arrivalWindowError}
            />
          </div>
        )}

        {startWindowOption === "available" && (
          <TimeSlotSelector
            value={
              arrivalWindow
                ? JSON.stringify({
                    arrivalWindowStarts: arrivalWindow.arrivalWindowStarts,
                    arrivalWindowEnds: arrivalWindow.arrivalWindowEnds,
                  })
                : ""
            }
            onChange={(val) => {
              try {
                const parsed = JSON.parse(val);
                setArrivalWindow({
                  arrivalWindowStarts: parsed.arrivalWindowStarts,
                  arrivalWindowEnds: parsed.arrivalWindowEnds,
                });

                if (
                  parsed.arrivalWindowStarts ===
                    arrivalWindowOptions?.morningArrival &&
                  parsed.arrivalWindowEnds === arrivalWindowOptions?.morningEnd
                ) {
                  setMoveWindow("morning");
                } else if (
                  parsed.arrivalWindowStarts ===
                    arrivalWindowOptions?.afternoonArrival &&
                  parsed.arrivalWindowEnds ===
                    arrivalWindowOptions?.afternoonEnd
                ) {
                  setMoveWindow("afternoon");
                } else {
                  setMoveWindow("custom"); // fallback
                }
              } catch {
                setArrivalWindow({
                  arrivalWindowStarts: "",
                  arrivalWindowEnds: "",
                });
                setMoveWindow("custom");
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
            errorMessage={errorMessage}
          />
        )}
      </div>
      <FormActionContainer className="pt-10">
        {" "}
        <FormActions
          onSave={validateInfoStep}
          onCancel={onCancel}
          isSaving={false}
          saveLabel="Next"
          cancelLabel="Cancel"
        />
      </FormActionContainer>
    </FormContainer>
  );
};

export default InfoStep;
