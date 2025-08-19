import FormActions from "@/app/components/shared/FormActions";
import React from "react";
import Deposit from "../sections/Deposit";
import InternalNotes from "../sections/InternalNotes";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import LineItems from "../sections/LineItems";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CostSummary from "../sections/CostSummary";
import LiabilityCoverageSection from "@/app/components/move/sections/LiabilityCoverageSection";
import LaborSection from "@/app/components/move/sections/LaborSection";
import AddTravelFee from "../sections/AddTravelFee";
import AddCreditCardFee from "../sections/AddCreditCardFee";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import AddPaymentType from "../sections/AddPaymentType";
import { Doc } from "@/convex/_generated/dataModel";
import { sumSegments } from "@/app/frontendUtils/helper";

interface CostStepProps {
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
  saveError?: string | null;
}

const CostStep = ({ onNext, onBack, isSaving, saveError }: CostStepProps) => {
  const {
    moveFormData,
    setMoveFormData,
    moveFormErrors,
    insurancePolicyOptions,
    setMoveFormErrors,
    segmentDistances,
  } = useMoveForm();

  const { totalMinutes } = sumSegments(segmentDistances);

  const customerMissingError = !moveFormData.moveCustomerId
    ? "Save customer on first step before proceeding"
    : null;

  const handleSelectPolicy = (policy: Doc<"insurancePolicies">) => {
    setMoveFormData({ ...moveFormData, liabilityCoverage: policy });
  };

  return (
    <FormContainer>
      <LaborSection
        isAdd={true}
        formData={moveFormData}
        onChange={(key, value) =>
          setMoveFormData((prev) => ({ ...prev, [key]: value }))
        }
        errors={moveFormErrors}
        setErrors={setMoveFormErrors}
        isEditing={true}
        totalDriveTime={totalMinutes}
      />

      <AddTravelFee />
      <LineItems />

      <LiabilityCoverageSection
        selectedPolicy={moveFormData.liabilityCoverage}
        policies={insurancePolicyOptions ?? []}
        onSelect={(policy) => {
          handleSelectPolicy(policy);
          return true;
        }}
        error={moveFormErrors.liabilityCoverage}
        isAdd={true}
      />

      <AddCreditCardFee />
      <Deposit />
      <AddPaymentType />
      <CostSummary />
      <InternalNotes />

      <FormActionContainer>
        <FormActions
          onSave={onNext}
          onCancel={onBack}
          isSaving={isSaving}
          saveLabel="Complete"
          cancelLabel="Back"
          error={saveError ?? customerMissingError}
          disabled={Boolean(customerMissingError)}
        />
      </FormActionContainer>
    </FormContainer>
  );
};

export default CostStep;
