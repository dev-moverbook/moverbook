"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import FormActions from "@/components/shared/buttons/FormActions";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";

interface ExternalReviewProps {
  move: Doc<"moves">;
}
const ExternalReview = ({ move }: ExternalReviewProps) => {
  const isDisabled = move.moveStatus !== "Completed";

  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);

  const { sendPresetScript, sendPresetScriptError } = useSendPresetScript();

  const handleSendExternalReview = async () => {
    setIsEmailLoading(true);
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.EMAIL_EXTERNAL_REVIEW,
    });
    setIsEmailLoading(false);
  };

  const handleSendExternalReviewSms = async () => {
    setIsSmsLoading(true);
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.SMS_EXTERNAL_REVIEW,
    });
    setIsSmsLoading(false);
  };
  return (
    <div>
      <SectionHeader
        showCheckmark
        className="mx-auto"
        title="External Review"
      />
      <SectionContainer >
        <FormActions
          onCancel={handleSendExternalReviewSms}
          onSave={(e) => {
            e.preventDefault();
            handleSendExternalReview();
          }}
          isSaving={isEmailLoading}
          isCanceling={isSmsLoading}
          error={sendPresetScriptError}
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
