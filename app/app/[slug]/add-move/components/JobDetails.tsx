import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import TrucksAndMovers from "./TrucksAndMovers";
import LineItems from "./LineItems";
import LiabilityCoverage from "./LiabilityCoverage";
import { Id } from "@/convex/_generated/dataModel";
import Deposit from "./Deposit";
import type { UserResource } from "@clerk/types";
import InternalNotes from "./InternalNotes";

interface JobDetailsProps {
  onNext: () => void;
  onBack: () => void;
  companyId: Id<"companies">;
  user: UserResource;
}

const JobDetails = ({ onNext, onBack, companyId, user }: JobDetailsProps) => {
  return (
    <SectionContainer>
      <Header3>Job Details</Header3>
      <TrucksAndMovers />
      <LineItems />
      <LiabilityCoverage companyId={companyId} />
      <Deposit companyId={companyId} />
      <InternalNotes user={user} companyId={companyId} />
      <FormActions
        onSave={onNext}
        onCancel={onBack}
        isSaving={false}
        saveLabel="Complete"
        cancelLabel="Back"
      />
    </SectionContainer>
  );
};

export default JobDetails;
