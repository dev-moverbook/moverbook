"use client";

import StarRating from "@/components/move/shared/StarRanking";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { PresSetScripts } from "@/types/enums";
import { useSendPresetScript } from "@/hooks/messages";

interface InternalReviewProps {
  internalReview: Doc<"internalReviews"> | null;
  move: Doc<"moves">;
}
const InternalReview = ({ internalReview, move }: InternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";
  const isComplete = !!internalReview?.rating;

  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);

  const { sendPresetScript, sendPresetScriptError } = useSendPresetScript();

  const handleSendInternalReviewEmail = async () => {
    setIsEmailLoading(true);
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.EMAIL_INTERNAL_REVIEW,
    });
    setIsEmailLoading(false);
  };

  const handleSendInternalReviewSms = async () => {
    setIsSmsLoading(true);
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.SMS_INTERNAL_REVIEW,
    });
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
        {!isComplete && (
          <FormActions
            onCancel={handleSendInternalReviewSms}
            onSave={(e) => {
              e.preventDefault();
              handleSendInternalReviewEmail();
            }}
            isSaving={isEmailLoading}
            isCanceling={isSmsLoading}
            error={sendPresetScriptError}
            saveLabel="Email"
            cancelLabel="Text"
            disabled={isDisabled}
            cancelDisabled={isDisabled}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default InternalReview;
