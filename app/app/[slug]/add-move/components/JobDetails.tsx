import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import TrucksAndMovers from "./TrucksAndMovers";
interface JobDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

const JobDetails = ({ onNext, onBack }: JobDetailsProps) => {
  return (
    <SectionContainer>
      <Header3>Job Details</Header3>
      <TrucksAndMovers />
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

export default JobDetails;
