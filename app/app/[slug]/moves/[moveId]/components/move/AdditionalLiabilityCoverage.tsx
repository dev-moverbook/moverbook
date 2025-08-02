"use client";

import SectionHeader from "@/app/components/shared/SectionHeader";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import React from "react";
import DisplaySignature from "@/app/components/move/shared/DisplaySignature";
import Signature from "@/app/components/move/shared/Signature";
import FormActions from "@/app/components/shared/FormActions";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCreateOrUpdateAdditionalLiabilityCoverage } from "../../../hooks/useCreateOrUpdateAdditionalLiabilityCoverage";
import AdditionalLiabilityTerms from "../copy/AdditionalLiabilityTerms";

interface AdditionalLiabilityCoverageProps {
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
  moveId: Id<"move">;
}

const AdditionalLiabilityCoverage = ({
  additionalLiabilityCoverage,
  moveId,
}: AdditionalLiabilityCoverageProps) => {
  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    additionalLiabilityCoverage ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null
  );
  const [isSendingSMS, setIsSendingSMS] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);

  const {
    createOrUpdateAdditionalLiabilityCoverage,
    error,
    setError,
    isLoading,
  } = useCreateOrUpdateAdditionalLiabilityCoverage();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isDisabled = !signatureDataUrl;

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
    <div>
      <SectionHeader
        className="mx-auto"
        title="Additional Liability Coverage"
      />
      <SectionContainer showBorder={false}>
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
          saveLabel="Send SMS"
          cancelLabel="Send Email"
          isSaving={isSendingSMS}
          isCanceling={isSendingEmail}
          error={error}
          cancelDisabled={isSendingEmail || isDisabled}
        />
      </SectionContainer>
    </div>
  );
};

export default AdditionalLiabilityCoverage;
