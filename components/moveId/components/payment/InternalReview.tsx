"use client";

import StarRating from "@/components/move/shared/StarRanking";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";

interface InternalReviewProps {
  internalReview: Doc<"internalReviews"> | null;
  move: Doc<"moves">;
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
