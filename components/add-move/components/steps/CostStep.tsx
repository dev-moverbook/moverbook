"use client";

import FormActions from "@/components/shared/buttons/FormActions";
import Deposit from "../sections/Deposit";
import InternalNotes from "../sections/InternalNotes";
import FormContainer from "@/components/shared/containers/FormContainer";
import LineItems from "../sections/LineItems";
import { useMoveForm } from "@/contexts/MoveFormContext";
import CostSummary from "../sections/CostSummary";
import LiabilityCoverageSection from "@/components/move/sections/LiabilityCoverageSection";
import LaborSection from "@/components/move/sections/LaborSection";
import AddTravelFee from "../sections/AddTravelFee";
import AddCreditCardFee from "../sections/AddCreditCardFee";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import AddPaymentType from "../sections/AddPaymentType";
import { Doc } from "@/convex/_generated/dataModel";
import { sumSegments } from "@/frontendUtils/helper";

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

  const isDisabled = !moveFormData.moveCustomerId || !moveFormData.referralId;

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
          disabled={isDisabled}
        />
      </FormActionContainer>
    </FormContainer>
  );
};

export default CostStep;
