"use client";

import FormContainer from "@/app/components/shared/containers/FormContainer";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import React, { useState } from "react";
import Header3 from "@/app/components/shared/heading/Header3";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import LabeledRadio from "@/app/components/shared/labeled/LabeledRadio";
import LabeledDateInput from "@/app/components/shared/labeled/LabeledDateInput";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import FormActions from "@/app/components/shared/FormActions";
import { useReferralSources } from "@/app/hooks/queries/useReferralSources";
import { Id } from "@/convex/_generated/dataModel";
import { useCompanyArrivalResult } from "@/app/hooks/queries/useCompanyArrivalResult";
import TimeSlotSelector from "@/app/components/shared/labeled/TimeSlotSelector";
import LabeledTimeInput from "@/app/components/shared/labeled/LabeledTimeInput";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import {
  SERVICE_TYPE_OPTIONS,
  ServiceType,
  START_WINDOW_OPTIONS,
  StartWindowOption,
} from "@/types/types";

interface PersonalDetailsProps {
  onNext: () => void;
  onCancel: () => void;
  companyId: Id<"companies"> | null;
}

const PersonalDetails = ({
  onNext,
  onCancel,
  companyId,
}: PersonalDetailsProps) => {
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
  } = useMoveForm();

  const [startWindowOption, setStartWindowOption] =
    useState<StartWindowOption>("available");
  const {
    options: referralOptions,
    isLoading: loadingReferrals,
    isError: referralQueryFailed,
    errorMessage: referralQueryErrorMessage,
  } = useReferralSources(companyId);

  const {
    arrivalWindow: arrivalWindowResult,
    isLoading: loadingArrivalWindow,
    isError: arrivalWindowQueryFailed,
    errorMessage: arrivalWindowQueryErrorMessage,
  } = useCompanyArrivalResult(companyId);

  return (
    <SectionContainer>
      <Header3>Personal Details</Header3>
      <FormContainer>
        <LabeledInput
          label="Full Name"
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
          value={serviceType}
          onChange={(value) => {
            setServiceType(value as ServiceType);
          }}
          options={SERVICE_TYPE_OPTIONS}
          error={serviceTypeError}
        />
        <LabeledSelect
          label="Referral Source"
          value={referralSource}
          onChange={(value) => {
            setReferralSource(value);
            setReferralSourceError(null);
          }}
          options={referralOptions}
          loading={loadingReferrals}
          error={referralSourceError}
          queryError={referralQueryFailed ? referralQueryErrorMessage : null}
        />

        <LabeledDateInput
          label="Move Date"
          value={moveDate}
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
              } catch {
                setArrivalWindow({
                  arrivalWindowStarts: "",
                  arrivalWindowEnds: "",
                });
              }
            }}
            options={
              arrivalWindowResult
                ? [
                    {
                      label: `${arrivalWindowResult.morningArrival} - ${arrivalWindowResult.morningEnd}`,
                      value: JSON.stringify({
                        arrivalWindowStarts: arrivalWindowResult.morningArrival,
                        arrivalWindowEnds: arrivalWindowResult.morningEnd,
                      }),
                    },
                    {
                      label: `${arrivalWindowResult.afternoonArrival} - ${arrivalWindowResult.afternoonEnd}`,
                      value: JSON.stringify({
                        arrivalWindowStarts:
                          arrivalWindowResult.afternoonArrival,
                        arrivalWindowEnds: arrivalWindowResult.afternoonEnd,
                      }),
                    },
                  ]
                : null
            }
            isLoading={loadingArrivalWindow}
            isError={arrivalWindowQueryFailed}
            errorMessage={arrivalWindowQueryErrorMessage}
          />
        )}
        <FormActionContainer>
          {" "}
          <FormActions
            onSave={onNext}
            onCancel={onCancel}
            isSaving={false}
            saveLabel="Next"
            cancelLabel="Cancel"
          />
        </FormActionContainer>
      </FormContainer>
    </SectionContainer>
  );
};

export default PersonalDetails;
