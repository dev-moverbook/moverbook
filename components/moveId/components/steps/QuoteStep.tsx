"use client";

import { useState } from "react";
import { formatServiceTypeLabel } from "@/frontendUtils/helper";
import QuoteSummary from "../quote/QuoteSummary";
import QuoteContact from "../quote/QuoteContact";
import QuoteLocation from "../quote/QuoteLocation";
import QuoteInventory from "../quote/QuoteInventory";
import QuoteCost from "../quote/QuoteCost";
import QuoteTerms from "../quote/QuoteTerms";
import QuoteSignature from "../quote/QuoteSignature";
import QuoteActions from "../quote/QuoteActions";
import { Doc } from "@/convex/_generated/dataModel";
import StepStatus from "../shared/StepStatus";
import { getQuoteStatusInfo } from "@/frontendUtils/tsxHelper";
import { useMoveContext } from "@/contexts/MoveContext";
import SectionContainer from "@/components/shared/containers/SectionContainer";

interface QuoteStepProps {
  quote: Doc<"quotes"> | null;
}

const QuoteStep = ({ quote }: QuoteStepProps) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const title = formatServiceTypeLabel(move.serviceType);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const quoteStatus = getQuoteStatusInfo(quote, move.moveStatus);

  return (
    <SectionContainer showBorder={false} className="px-0">
      <StepStatus
        items={[
          {
            label: "Quote Status",
            value: quoteStatus.label,
            icon: quoteStatus.icon,
          },
          { label: "Title", value: title },
        ]}
      />
      <>
        <QuoteSummary />
        <QuoteContact />
        <QuoteLocation />
        <QuoteInventory />
        <QuoteCost />
        <QuoteTerms />
        <QuoteSignature setSignatureDataUrl={setSignatureDataUrl} />
        <QuoteActions signatureDataUrl={signatureDataUrl} />
      </>
    </SectionContainer>
  );
};

export default QuoteStep;
