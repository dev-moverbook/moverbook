"use client";

import StarRating from "@/components/move/shared/StarRanking";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { useSendInternalReview } from "@/hooks/internalReviews";
import { useState } from "react";

interface InternalReviewProps {
  internalReview: Doc<"internalReviews"> | null;
  move: Doc<"moves">;
}
const InternalReview = ({ internalReview, move }: InternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";
  const isComplete = !!internalReview?.rating;

  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
  const { sendInternalReview, sendInternalReviewError } =
    useSendInternalReview();

  const handleSendInternalReviewEmail = async () => {
    setIsEmailLoading(true);
    await sendInternalReview(move._id, "email");
    setIsEmailLoading(false);
  };

  const handleSendInternalReviewSms = async () => {
    setIsSmsLoading(true);
    await sendInternalReview(move._id, "sms");
    setIsSmsLoading(false);
  };
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
          onCancel={handleSendInternalReviewSms}
          onSave={(e) => {
            e.preventDefault();
            handleSendInternalReviewEmail();
          }}
          isSaving={isEmailLoading}
          isCanceling={isSmsLoading}
          error={sendInternalReviewError}
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
