"use client";

import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import PreMoveTerms from "@/components/moveId/components/copy/PreMoveTerms";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import ContractActions from "./ContractActions";
import SectionHeader from "@/components/shared/section/SectionHeader";

interface ContractSectionProps {
  contract: Doc<"contracts">;
}

const ContractSection = ({ contract }: ContractSectionProps) => {
  const isCompleted = !!contract.customerSignature;
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const showContractActions =
    contract.customerSignature === undefined &&
    contract.customerSignedAt === undefined;

  return (
    <>
      <SectionHeader
        className="pt-0"
        title="Contract"
        isCompleted={isCompleted}
        showCheckmark
      />
      <SectionContainer showBorder={false}>
        <PreMoveTerms />
        {contract.repSignature && contract.repSignedAt && (
          <DisplaySignature
            image={contract.repSignature}
            timestamp={contract.repSignedAt}
            alt="Rep Signature"
            title="Rep Signature"
          />
        )}
        {contract.customerSignature && contract.customerSignedAt ? (
          <DisplaySignature
            image={contract.customerSignature}
            timestamp={contract.customerSignedAt}
            alt="Customer Signature"
            title="Customer Signature"
          />
        ) : (
          <Signature
            title="Customer Signature"
            onChange={setSignatureDataUrl}
          />
        )}
        {showContractActions && (
          <ContractActions
            signatureDataUrl={signatureDataUrl}
            contractId={contract._id}
          />
        )}
      </SectionContainer>
    </>
  );
};

export default ContractSection;
