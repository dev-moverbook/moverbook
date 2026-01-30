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
import { useCreateOrUpdateContract } from "@/hooks/contracts";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";
import SingleFormAction from "@/components/shared/buttons/SingleFormAction";

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
  const [customerSignatureDataUrl, setCustomerSignatureDataUrl] = useState<string | null>(null);
  const [isSmsLoading, setIsSmsLoading] = useState<boolean>(false);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false);

  const { createOrUpdateContract, createOrUpdateContractError, createOrUpdateContractLoading } =
    useCreateOrUpdateContract();

  const { sendPresetScript, sendPresetScriptError } = useSendPresetScript();

  const showRepSignature = !!repSignature && repSignedAt;
  const showCustomerSignature = !!customerSignature && customerSignedAt;
  const isCompleted = !!repSignature && !!customerSignature;

  const handleSMS = async () => {
    setIsSmsLoading(true);
   
    await sendPresetScript({
      moveId,
      preSetTypes: PresSetScripts.SMS_CONTRACT,
    });
    setIsSmsLoading(false);
  };

  const handleEmail = async () => {
    setIsEmailLoading(true);
 
    await sendPresetScript({
      moveId,
      preSetTypes: PresSetScripts.EMAIL_CONTRACT,
    });
    setIsEmailLoading(false);
  };

  const handleSave = async () => {
    const data = {
      repSignature: signatureDataUrl || undefined,
      customerSignature: customerSignatureDataUrl || undefined,
    }
      await createOrUpdateContract(moveId, data);

      setSignatureDataUrl(null);
      setCustomerSignatureDataUrl(null);
  };

  const collapsePreMove = !isCompleted;

  
  const showSave = signatureDataUrl || customerSignatureDataUrl;
  const showContractActions = contract?.status === "pending" && !showSave;


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
      <SectionContainer >
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
        {showCustomerSignature ? (
          <DisplaySignature
            image={customerSignature}
            timestamp={customerSignedAt}
            alt="Customer Signature"
            title="Customer Signature"
          />
        ) : (
          <Signature title="Customer Signature" onChange={setCustomerSignatureDataUrl} collapsible />
        )}
        {showSave && (
        <SingleFormAction
          submitLabel="Save"
          onSubmit={handleSave}
          isSubmitting={createOrUpdateContractLoading}
          error={createOrUpdateContractError}
        />
        )}
        {showContractActions && (
        <FormActions
          onSave={(e) => {
            e.preventDefault();
            handleEmail();
          }}
          onCancel={handleSMS}
          saveLabel="Email"
          cancelLabel="Text"
          isSaving={isEmailLoading}
          isCanceling={isSmsLoading}
          error={createOrUpdateContractError || sendPresetScriptError}
          
          />
        )}
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default Contract;
