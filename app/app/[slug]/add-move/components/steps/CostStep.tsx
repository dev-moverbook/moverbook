import FormActions from "@/app/components/shared/FormActions";
import React from "react";
import Deposit from "../sections/Deposit";
import InternalNotes from "../sections/InternalNotes";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import LineItems from "../sections/LineItems";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CostSummary from "../sections/CostSummary";
import LiabilityCoverageSection from "@/app/components/move/sections/LiabilityCoverageSection";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import LaborSection from "@/app/components/move/sections/LaborSection";
import AddTravelFee from "../sections/AddTravelFee";
import AddCreditCardFee from "../sections/AddCreditCardFee";

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
  } = useMoveForm();

  const handleSelectPolicy = (policy: InsurancePolicySchema) => {
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
      />
      <AddTravelFee />
      <LineItems />
      <LiabilityCoverageSection
        selectedPolicy={moveFormData.liabilityCoverage}
        policies={insurancePolicyOptions ?? []}
        onSelect={handleSelectPolicy}
        error={moveFormErrors.liabilityCoverage}
        isAdd={true}
      />
      <AddCreditCardFee />

      <Deposit />

      <CostSummary />
      <InternalNotes />

      <FormActions
        onSave={onNext}
        onCancel={onBack}
        isSaving={isSaving}
        saveLabel="Complete"
        cancelLabel="Back"
        error={saveError}
      />
    </FormContainer>
  );
};

export default CostStep;
