"use client";

import SectionHeader from "@/app/components/shared/SectionHeader";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import React from "react";
import { PreMoveDocSchema } from "@/types/convex-schemas";
import DisplaySignature from "@/app/components/move/shared/DisplaySignature";
import Signature from "@/app/components/move/shared/Signature";
import PreMoveTerms from "../copy/PreMoveTerms";
import FormActions from "@/app/components/shared/FormActions";
import { useCreateOrUpdatePreMoveDoc } from "../../../hooks/useCreateOrUpdatePreMoveDoc";
import { Id } from "@/convex/_generated/dataModel";

interface PreMoveProps {
  preMoveDoc: PreMoveDocSchema | null;
  moveId: Id<"move">;
}

const PreMove = ({ preMoveDoc, moveId }: PreMoveProps) => {
  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    preMoveDoc ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null
  );
  const [isSendingSMS, setIsSendingSMS] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);

  const {
    createOrUpdatePreMoveDoc,
    createOrUpdatePreMoveDocError,
    setCreateOrUpdatePreMoveDocError,
  } = useCreateOrUpdatePreMoveDoc();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isDisabled = !signatureDataUrl;

  const handleSMS = async () => {
    setCreateOrUpdatePreMoveDocError(null);
    if (signatureDataUrl) {
      setIsSendingSMS(true);
      await createOrUpdatePreMoveDoc(moveId, {
        repSignature: signatureDataUrl,
      });
      setIsSendingSMS(false);
    }
  };

  const handleEmail = async () => {
    setCreateOrUpdatePreMoveDocError(null);
    if (signatureDataUrl) {
      setIsSendingEmail(true);
      await createOrUpdatePreMoveDoc(moveId, {
        repSignature: signatureDataUrl,
      });
      setIsSendingEmail(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Pre Move Doc" />
      <SectionContainer>
        <PreMoveTerms />
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
          error={createOrUpdatePreMoveDocError}
          cancelDisabled={isSendingEmail || isDisabled}
        />
      </SectionContainer>
    </div>
  );
};

export default PreMove;
