import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";

interface MoveDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

const MoveDetails = ({ onNext, onBack }: MoveDetailsProps) => {
  return (
    <SectionContainer>
      <Header3>Move Details</Header3>
      <FormActions
        onSave={onNext}
        onCancel={onBack}
        isSaving={false}
        saveLabel="Next"
        cancelLabel="Back"
      />
    </SectionContainer>
  );
};

export default MoveDetails;
