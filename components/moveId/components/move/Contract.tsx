"use client";

import { useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import PreMoveTerms from "../copy/PreMoveTerms";
import FormActions from "@/components/shared/buttons/FormActions";
import CollapsibleSection from "@/components/shared/buttons/CollapsibleSection";
import { Doc } from "@/convex/_generated/dataModel";
import { useMoveContext } from "@/contexts/MoveContext";
import { useCreateOrUpdateContract, useSendContract } from "@/hooks/contracts";

interface ContractProps {
  contract: Doc<"contracts"> | null;
}

const Contract = ({ contract }: ContractProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { _id: moveId } = move;

  const { customerSignature, repSignature, customerSignedAt, repSignedAt } =
    contract ?? {};

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);

  const { createOrUpdateContract, createOrUpdateContractError } =
    useCreateOrUpdateContract();

  const { sendContract, sendContractError } = useSendContract();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isDisabled = !signatureDataUrl;
  const isCompleted = !!repSignature && !!customerSignature;

  const handleSMS = async () => {
    setIsSmsLoading(true);
    if (signatureDataUrl) {
      await createOrUpdateContract(moveId, {
        repSignature: signatureDataUrl,
      });
    }
    await sendContract(moveId, "sms");
    setIsSmsLoading(false);
  };

  const handleEmail = async () => {
    setIsEmailLoading(true);
    if (signatureDataUrl) {
      await createOrUpdateContract(moveId, {
        repSignature: signatureDataUrl,
      });
    }
    await sendContract(moveId, "email");
    setIsEmailLoading(false);
  };

  const collapsePreMove = !isCompleted;

  return (
    <CollapsibleSection
      title="Contract"
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
          onSave={(e) => {
            e.preventDefault();
            handleEmail();
          }}
          onCancel={handleSMS}
          saveLabel="Email"
          cancelLabel="Text"
          isSaving={isEmailLoading}
          isCanceling={isSmsLoading}
          error={createOrUpdateContractError || sendContractError}
          cancelDisabled={isDisabled}
        />
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default Contract;
