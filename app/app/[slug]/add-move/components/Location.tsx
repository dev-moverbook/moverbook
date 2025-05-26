import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import MoveAddress from "./MoveAddress";
interface LocationProps {
  onNext: () => void;
  onBack: () => void;
}

const Location = ({ onNext, onBack }: LocationProps) => {
  return (
    <SectionContainer>
      <Header3>Location</Header3>
      <MoveAddress title="Starting Location" completed={true} />
      <MoveAddress title="Destination Location" completed={true} />
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

export default Location;
