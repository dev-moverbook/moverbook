"use client";

import React from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import FormActions from "@/components/shared/FormActions";
import { Doc } from "@/convex/_generated/dataModel";
import { useCreateOrUpdateAdditionalLiabilityCoverage } from "../../../../hooks/waiver/useCreateOrUpdateAdditionalLiabilityCoverage";
import AdditionalLiabilityTerms from "../copy/AdditionalLiabilityTerms";
import { useMoveContext } from "@/contexts/MoveContext";
import CollapsibleSection from "@/components/shared/buttons/CollapsibleSection";

interface AdditionalLiabilityCoverageProps {
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
}

const AdditionalLiabilityCoverage = ({
  additionalLiabilityCoverage,
}: AdditionalLiabilityCoverageProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    additionalLiabilityCoverage ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null
  );
  const [isSendingSMS, setIsSendingSMS] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);

  const { createOrUpdateAdditionalLiabilityCoverage, error, setError } =
    useCreateOrUpdateAdditionalLiabilityCoverage();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isDisabled = !signatureDataUrl;
  const isCompleted = !!showRepSignature && !!showCustomerSignature;

  const handleSMS = async () => {
    setError(null);
    if (signatureDataUrl) {
      setIsSendingSMS(true);
      await createOrUpdateAdditionalLiabilityCoverage(moveId, {
        repSignature: signatureDataUrl,
      });
      setIsSendingSMS(false);
    }
  };

  const handleEmail = async () => {
    setError(null);
    if (signatureDataUrl) {
      setIsSendingEmail(true);
      await createOrUpdateAdditionalLiabilityCoverage(moveId, {
        repSignature: signatureDataUrl,
      });
      setIsSendingEmail(false);
    }
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
          isSaving={isSendingSMS}
          isCanceling={isSendingEmail}
          error={error}
          cancelDisabled={isSendingEmail || isDisabled}
        />
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default AdditionalLiabilityCoverage;
