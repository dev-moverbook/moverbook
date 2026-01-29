"use client";

import { useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import FormActions from "@/components/shared/buttons/FormActions";
import { Doc } from "@/convex/_generated/dataModel";
import AdditionalLiabilityTerms from "../copy/AdditionalLiabilityTerms";
import { useMoveContext } from "@/contexts/MoveContext";
import CollapsibleSection from "@/components/shared/buttons/CollapsibleSection";
import { useCreateOrUpdateWaiver } from "@/hooks/waivers";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";

interface WaiverProps {
  waiver: Doc<"waivers"> | null;
}

const Waiver = ({ waiver }: WaiverProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    waiver ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);
  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);

  const {
    createOrUpdateWaiver,
    isLoading: createOrUpdateWaiverLoading,
    error,
  } = useCreateOrUpdateWaiver();
  const { sendPresetScript, sendPresetScriptError } = useSendPresetScript();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isCompleted = !!showRepSignature && !!showCustomerSignature;

  const isDisabled = !signatureDataUrl && !waiver;

  const showWaiverActions = waiver?.status !== "completed";

  ;

  const handleSMS = async () => {
    setIsSmsLoading(true);
    if (signatureDataUrl) {
      await createOrUpdateWaiver(moveId, { repSignature: signatureDataUrl });
    }
    await sendPresetScript({
      moveId,
      preSetTypes: PresSetScripts.SMS_WAIVER,
    });
    setIsSmsLoading(false);
  };

  const handleEmail = async () => {
    setIsEmailLoading(true);
    if (signatureDataUrl) {
      await createOrUpdateWaiver(moveId, { repSignature: signatureDataUrl });
    }
    await sendPresetScript({
      moveId,
      preSetTypes: PresSetScripts.EMAIL_WAIVER,
    });
    setIsEmailLoading(false);
  };

  return (
    <CollapsibleSection
      title="Waiver"
      defaultOpen={!isCompleted}
      headerClassName="mx-auto"
      showCheckmark
      isCompleted={isCompleted}
      toggleLabels={{ open: "Hide", closed: "Show" }}
      className="max-w-screen-sm mx-auto border-b md:border-none"
    >
      <SectionContainer>
        <AdditionalLiabilityTerms />
        {showRepSignature ? (
          <DisplaySignature
            image={repSignature}
            timestamp={repSignedAt}
            alt="Rep Signature"
            title="Rep Signature"
          />
        ) : (
          <Signature title="Rep Signature" onChange={setSignatureDataUrl} />
        )}
        {showCustomerSignature && (
          <DisplaySignature
            image={customerSignature}
            timestamp={customerSignedAt}
            alt="Customer Signature"
            title="Customer Signature"
          />
        )}
        {showWaiverActions && (
        <FormActions
          disabled={isDisabled}
          cancelDisabled={isDisabled || createOrUpdateWaiverLoading}
          onSave={(e) => {
            e.preventDefault();
            handleEmail();
          }}
          onCancel={handleSMS}
          saveLabel="Email"
          cancelLabel="Text"
          isSaving={isEmailLoading}
          isCanceling={isSmsLoading}
          error={error || sendPresetScriptError}
        />
        )}
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default Waiver;
