"use client";

import StarRating from "@/app/components/move/shared/StarRanking";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { InternalReviewSchema } from "@/types/convex-schemas";
import { MoveSchema } from "@/types/convex-schemas";

interface InternalReviewProps {
  internalReview: InternalReviewSchema | null;
  move: MoveSchema;
}
const InternalReview = ({ internalReview, move }: InternalReviewProps) => {
  return (
    <div>
      <SectionHeader title="Internal Review" />
      <SectionContainer>
        <StarRating value={internalReview?.rating ?? null} readOnly />

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

export default InternalReview;
