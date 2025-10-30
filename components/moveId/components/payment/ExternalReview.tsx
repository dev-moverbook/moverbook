"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";

interface ExternalReviewProps {
  move: Doc<"moves">;
}
const ExternalReview = ({ move }: ExternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";

  return (
    <div>
      <SectionHeader
        showCheckmark
        className="mx-auto"
        title="External Review"
      />
      <SectionContainer showBorder={false}>
        <FormActions
          onCancel={() => {}}
          onSave={() => {}}
          isSaving={false}
          error={null}
          saveLabel="Email"
          cancelLabel="Text"
          disabled={isDisabled}
          cancelDisabled={isDisabled}
        />
      </SectionContainer>
    </div>
  );
};

export default ExternalReview;
