"use client";

import SectionHeader from "@/app/components/shared/SectionHeader";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import React from "react";
import DisplaySignature from "@/app/components/move/shared/DisplaySignature";
import Signature from "@/app/components/move/shared/Signature";
import PreMoveTerms from "../copy/PreMoveTerms";
import FormActions from "@/app/components/shared/FormActions";
import { useCreateOrUpdatePreMoveDoc } from "../../../hooks/useCreateOrUpdatePreMoveDoc";
import { Doc } from "@/convex/_generated/dataModel";
import { useMoveContext } from "@/app/contexts/MoveContext";

interface PreMoveProps {
  preMoveDoc: Doc<"preMoveDocs"> | null;
}

const PreMove = ({ preMoveDoc }: PreMoveProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;
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
      <SectionHeader className="mx-auto" title="Pre Move Doc" />
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
          saveLabel="Email"
          cancelLabel="Text"
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
