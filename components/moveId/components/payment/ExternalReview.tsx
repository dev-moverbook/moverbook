"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { useSendExternalReview } from "@/hooks/externalReviews";
import { useState } from "react";

interface ExternalReviewProps {
  move: Doc<"moves">;
}
const ExternalReview = ({ move }: ExternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";

  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
  const { sendExternalReview, sendExternalReviewError } =
    useSendExternalReview();

  const handleSendExternalReviewEmail = async () => {
    setIsEmailLoading(true);
    await sendExternalReview(move._id, "email");
    setIsEmailLoading(false);
  };

  const handleSendExternalReviewSms = async () => {
    setIsSmsLoading(true);
    await sendExternalReview(move._id, "sms");
    setIsSmsLoading(false);
  };

  return (
    <div>
      <SectionHeader
        showCheckmark
        className="mx-auto"
        title="External Review"
      />
      <SectionContainer showBorder={false}>
        <FormActions
          onCancel={handleSendExternalReviewSms}
          onSave={(e) => {
            e.preventDefault();
            handleSendExternalReviewEmail();
          }}
          isSaving={isEmailLoading}
          isCanceling={isSmsLoading}
          error={sendExternalReviewError}
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
