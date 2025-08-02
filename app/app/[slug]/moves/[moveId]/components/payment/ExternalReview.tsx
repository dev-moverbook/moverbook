"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";

interface ExternalReviewProps {
  move: Doc<"move">;
}
const ExternalReview = ({ move }: ExternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";
  return (
    <div>
      <SectionHeader className="mx-auto" title="External Review" />
      <SectionContainer showBorder={false}>
        <FormActions
          onCancel={() => {}}
          onSave={() => {}}
          isSaving={false}
          error={null}
          saveLabel="Text"
          cancelLabel="Email"
          disabled={isDisabled}
          cancelDisabled={isDisabled}
        />
      </SectionContainer>
    </div>
  );
};

export default ExternalReview;
