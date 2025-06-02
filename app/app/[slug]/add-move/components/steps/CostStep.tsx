import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import TrucksAndMovers from "../sections/TrucksAndMovers";
import Deposit from "../sections/Deposit";
import InternalNotes from "../InternalNotes";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import LineItems from "../sections/LineItems";
import LiabilityCoverage from "../sections/LiabilityCoverage";
interface CostStepProps {
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
  saveError?: string | null;
}

const CostStep = ({ onNext, onBack, isSaving, saveError }: CostStepProps) => {
  return (
    <FormContainer>
      <Header2>Costs</Header2>
      <TrucksAndMovers />
      <LineItems />
      <LiabilityCoverage />
      <Deposit />
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
