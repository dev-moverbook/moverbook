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
import { useCreateOrUpdateWaiver, useSendWaiver } from "@/hooks/waivers";

interface WaiverProps {
  waiver: Doc<"waivers"> | null;
}

const Waiver = ({ waiver }: WaiverProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  // Destructure waiver details (handles null waiver gracefully)
  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    waiver ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSmsLoading, setIsSmsLoading] = useState(false);

  const {
    createOrUpdateWaiver,
    isLoading: createOrUpdateWaiverLoading,
    error,
  } = useCreateOrUpdateWaiver();
  const { sendWaiver, sendWaiverError } = useSendWaiver();

  // These determine when the signed images and times are shown
  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isCompleted = !!showRepSignature && !!showCustomerSignature;

  // Button is only enabled when signature is drawn
  const isDisabled = !signatureDataUrl;

  const handleSMS = async () => {
    setIsSmsLoading(true);
    if (signatureDataUrl) {
      await createOrUpdateWaiver(moveId, { repSignature: signatureDataUrl });
    }
    await sendWaiver(moveId, "sms");
    setIsSmsLoading(false);
  };

  const handleEmail = async () => {
    setIsEmailLoading(true);
    if (signatureDataUrl) {
      await createOrUpdateWaiver(moveId, { repSignature: signatureDataUrl });
    }
    await sendWaiver(moveId, "email");
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
          error={error || sendWaiverError}
        />
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default Waiver;
