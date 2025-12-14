"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import DocumentsStatus from "./DocumentsStatus";
import ContractSection from "./contract/ContractSection";
import WaiverSection from "./waiver/WaiverSection";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";

const DocumentsStep = () => {
  const { move } = usePublicMoveIdContext();
  const contract = move.contract;
  const waiver = move.waiver;
  return (
    <SectionContainer showBorder={false} className="px-0">
      <DocumentsStatus contract={contract} waiver={waiver} />
      {contract && <ContractSection contract={contract} />}
      {waiver && <WaiverSection waiver={waiver} />}
    </SectionContainer>
  );
};

export default DocumentsStep;
