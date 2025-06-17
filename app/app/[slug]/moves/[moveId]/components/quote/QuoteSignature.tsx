"use client";

import React from "react";
import { MoveSchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import Signature from "@/app/components/move/shared/Signature";
import { QuoteSchema } from "@/types/convex-schemas";
import DisplaySignature from "@/app/components/move/shared/DisplaySignature";
interface QuoteSignatureProps {
  move: MoveSchema;
  setSignatureDataUrl: (dataUrl: string | null) => void;
  quote: QuoteSchema | null;
}

const QuoteSignature = ({
  move,
  setSignatureDataUrl,
  quote,
}: QuoteSignatureProps) => {
  const showRepSignature =
    (!!quote?.repSignature && quote?.status === "pending") ||
    quote?.status === "completed";

  const showCustomerSignature =
    !!quote?.customerSignature && quote?.status === "completed";

  return (
    <div>
      <SectionHeader title="Signature" />
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
