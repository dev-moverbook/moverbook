"use client";

import React, { useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import PreMoveTerms from "../copy/PreMoveTerms";
import FormActions from "@/components/shared/FormActions";
import CollapsibleSection from "@/components/shared/buttons/CollapsibleSection";
import { useCreateOrUpdatePreMoveDoc } from "../../../../hooks/contracts/useCreateOrUpdatePreMoveDoc";
import { Doc } from "@/convex/_generated/dataModel";
import { useMoveContext } from "@/contexts/MoveContext";

interface PreMoveProps {
  preMoveDoc: Doc<"preMoveDocs"> | null;
}

const PreMove = ({ preMoveDoc }: PreMoveProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    preMoveDoc ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const {
    createOrUpdatePreMoveDoc,
    createOrUpdatePreMoveDocError,
    setCreateOrUpdatePreMoveDocError,
  } = useCreateOrUpdatePreMoveDoc();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isDisabled = !signatureDataUrl;
  const isCompleted = !!repSignature && !!customerSignature;

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

  const collapsePreMove = !isCompleted;

  return (
    <CollapsibleSection
      title="Pre Move Doc"
      defaultOpen={collapsePreMove}
      headerClassName="mx-auto"
      showCheckmark
      isCompleted={isCompleted}
      toggleLabels={{ open: "Hide", closed: "Show" }}
      className="max-w-screen-sm mx-auto border-b md:border-none"
    >
      <SectionContainer showBorder={false}>
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
    </CollapsibleSection>
  );
};

export default PreMove;
