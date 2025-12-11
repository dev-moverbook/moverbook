"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import Signature from "@/components/move/shared/Signature";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import { Doc } from "@/convex/_generated/dataModel";

interface QuoteSignatureProps {
  setSalesRepSignatureDataUrl?: (dataUrl: string | null) => void;
  setCustomerSignatureDataUrl?: (dataUrl: string | null) => void;

  quote: Doc<"quotes"> | null;
}

const QuoteSignature = ({
  setSalesRepSignatureDataUrl,
  setCustomerSignatureDataUrl,
  quote,
}: QuoteSignatureProps) => {
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
          <Signature
            title="Sales Rep Signature"
            onChange={setSalesRepSignatureDataUrl ?? (() => {})}
          />
        )}
        {showCustomerSignature ? (
          <DisplaySignature
            image={quote.customerSignature || ""}
            timestamp={quote.customerSignedAt || 0}
            alt="Customer Signature"
            title="Customer Signature"
          />
        ) : (
          <Signature
            title="Customer Signature"
            onChange={setCustomerSignatureDataUrl ?? (() => {})}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default QuoteSignature;
