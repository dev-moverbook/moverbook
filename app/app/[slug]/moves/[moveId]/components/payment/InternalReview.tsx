"use client";

import StarRating from "@/app/components/move/shared/StarRanking";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";

interface InternalReviewProps {
  internalReview: Doc<"internalReview"> | null;
  move: Doc<"move">;
}
const InternalReview = ({ internalReview, move }: InternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";
  const isComplete = !!internalReview?.rating;
  return (
    <div>
      <SectionHeader
        className="mx-auto"
        title="Internal Review"
        showCheckmark
        isCompleted={isComplete}
      />
      <SectionContainer>
        <StarRating value={internalReview?.rating ?? null} readOnly />

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

export default InternalReview;
