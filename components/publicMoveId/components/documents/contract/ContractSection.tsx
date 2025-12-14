"use client";

import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import PreMoveTerms from "@/components/moveId/components/copy/PreMoveTerms";
import CollapsibleSection from "@/components/shared/buttons/CollapsibleSection";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import ContractActions from "./ContractActions";

interface ContractSectionProps {
  contract: Doc<"contracts">;
}

const ContractSection = ({ contract }: ContractSectionProps) => {
  const isCompleted = !!contract.customerSignature;
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  return (
    <CollapsibleSection
      title="Contract"
      defaultOpen={!isCompleted}
      headerClassName="mx-auto"
      showCheckmark
      isCompleted={isCompleted}
      toggleLabels={{ open: "Hide", closed: "Show" }}
      className="max-w-screen-sm mx-auto border-b md:border-none"
    >
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
        <ContractActions
          signatureDataUrl={signatureDataUrl}
          contractId={contract._id}
        />
      </SectionContainer>
    </CollapsibleSection>
  );
};

export default ContractSection;
