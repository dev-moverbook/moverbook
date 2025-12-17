"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import QuoteSummary from "@/components/moveId/components/quote/QuoteSummary";
import QuoteLocation from "@/components/moveId/components/quote/QuoteLocation";
import QuoteInventory from "@/components/moveId/components/quote/QuoteInventory";
import QuoteCost from "@/components/moveId/components/quote/QuoteCost";
import QuoteTerms from "@/components/moveId/components/quote/QuoteTerms";
import QuoteSignature from "@/components/moveId/components/quote/QuoteSignature";
import { useState } from "react";
import DepositPaymentSection from "./DepositPaymentSection";
import QuoteContactProvider from "./QuoteContactProvider";

const PublicQuotesStep = () => {
  const [customerSignatureDataUrl, setCustomerSignatureDataUrl] = useState<
    string | null
  >(null);
  const { move } = usePublicMoveIdContext();
  const {
    quote,
    company,

    policy,
    move: moveData,
  } = move;
  const showDeposit = quote?.status !== "completed";

  return (
    <SectionContainer showBorder={false} className="p-0 pb-10">
      <QuoteSummary move={moveData} company={company} />
      <QuoteContactProvider />
      <QuoteLocation move={moveData} />
      <QuoteInventory move={moveData} />
      <QuoteCost move={moveData} />
      <QuoteTerms policy={policy} />
      <QuoteSignature
        quote={quote}
        setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
      />
      {showDeposit && (
        <DepositPaymentSection
          move={moveData}
          signatureDataUrl={customerSignatureDataUrl}
        />
      )}
    </SectionContainer>
  );
};

export default PublicQuotesStep;
