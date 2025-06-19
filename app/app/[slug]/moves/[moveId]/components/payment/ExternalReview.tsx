"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { MoveSchema } from "@/types/convex-schemas";

interface ExternalReviewProps {
  move: MoveSchema;
}
const ExternalReview = ({ move }: ExternalReviewProps) => {
  return (
    <div>
      <SectionHeader title="External Review" />
      <SectionContainer>
        <FormActions
          onCancel={() => {}}
          onSave={() => {}}
          isSaving={false}
          error={null}
          saveLabel="Text"
          cancelLabel="Email"
        />
      </SectionContainer>
    </div>
  );
};

export default ExternalReview;
