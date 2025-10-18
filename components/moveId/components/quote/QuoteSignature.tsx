"use client";

import React from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import Signature from "@/components/move/shared/Signature";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import { useMoveContext } from "@/contexts/MoveContext";
interface QuoteSignatureProps {
  setSignatureDataUrl: (dataUrl: string | null) => void;
}

const QuoteSignature = ({ setSignatureDataUrl }: QuoteSignatureProps) => {
  const { moveData } = useMoveContext();
  const { quote } = moveData;
  const showRepSignature =
    (!!quote?.repSignature && quote?.status === "pending") ||
    quote?.status === "completed";

  const showCustomerSignature =
    !!quote?.customerSignature && quote?.status === "completed";

  return (
    <div>
      <SectionHeader className="mx-auto" title="Signature" />
      <SectionContainer>
        {showRepSignature ? (
          <DisplaySignature
            image={quote.repSignature || ""}
            timestamp={quote.repSignedAt || 0}
            alt="Rep Signature"
            title="Sales Rep Signature"
          />
        ) : (
          <Signature onChange={setSignatureDataUrl} />
        )}
        {showCustomerSignature && (
          <DisplaySignature
            image={quote.customerSignature || ""}
            timestamp={quote.customerSignedAt || 0}
            alt="Customer Signature"
            title="Customer Signature"
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default QuoteSignature;
