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
import { useCreateOrUpdateWaiver } from "@/hooks/waivers/useCreateOrUpdateWaiver";
import { useSendWaiver } from "@/hooks/waivers/useSendWaiver";

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

  const {
    createOrUpdateWaiver,
    isLoading: createOrUpdateWaiverLoading,
    error,
    setError,
  } = useCreateOrUpdateWaiver();
  const { sendWaiver, sendWaiverLoading, sendWaiverError, setSendWaiverError } =
    useSendWaiver();
  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isDisabled = !signatureDataUrl;
  const isCompleted = !!showRepSignature && !!showCustomerSignature;

  const handleSMS = async () => {
    if (signatureDataUrl) {
      await createOrUpdateWaiver(moveId, { repSignature: signatureDataUrl });
    }
    await sendWaiver(moveId, "sms");
  };

  const handleEmail = async () => {
    if (signatureDataUrl) {
      await createOrUpdateWaiver(moveId, { repSignature: signatureDataUrl });
    }
    await sendWaiver(moveId, "email");
  };

  return (
    <CollapsibleSection
      title="Waiver"
      defaultOpen={false}
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
          <Signature onChange={setSignatureDataUrl} />
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
          onSave={(e) => {
            e.preventDefault();
            handleSMS();
          }}
          onCancel={handleEmail}
          saveLabel="Email"
          cancelLabel="Text"
          isSaving={createOrUpdateWaiverLoading || sendWaiverLoading}
          isCanceling={createOrUpdateWaiverLoading || sendWaiverLoading}
          error={error || sendWaiverError}
          cancelDisabled={
            isDisabled || createOrUpdateWaiverLoading || sendWaiverLoading
          }
        />
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default Waiver;
