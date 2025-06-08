import FormActions from "@/app/components/shared/FormActions";
import React from "react";
import TrucksAndMovers from "../sections/TrucksAndMovers";
import Deposit from "../sections/Deposit";
import InternalNotes from "../sections/InternalNotes";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import LineItems from "../sections/LineItems";
import LiabilityCoverage from "../sections/LiabilityCoverage";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CostSummary from "../sections/CostSummary";
interface CostStepProps {
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
  saveError?: string | null;
}

const CostStep = ({ onNext, onBack, isSaving, saveError }: CostStepProps) => {
  const { isCostSectionComplete } = useMoveForm();
  return (
    <FormContainer>
      <Header2 isCompleted={isCostSectionComplete}>Costs</Header2>
      <TrucksAndMovers />
      <LineItems />
      <LiabilityCoverage />
      <Deposit />
      <InternalNotes />
      <CostSummary />
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
