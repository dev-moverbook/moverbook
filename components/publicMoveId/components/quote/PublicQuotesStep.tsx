"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import QuoteSummary from "@/components/moveId/components/quote/QuoteSummary";
import QuoteCost from "@/components/moveId/components/quote/QuoteCost";
import QuoteTerms from "@/components/moveId/components/quote/QuoteTerms";
import QuoteSignature from "@/components/moveId/components/quote/QuoteSignature";
import { useState } from "react";
import QuoteContactProvider from "./QuoteContactProvider";
import EditableQuoteSection from "./EditableQuoteSection";
import DepositPaymentSection from "./DepositPaymentSection";
import CustomerQuoteSignature from "./CustomerQuoteSignature";
import NoDepositPaymentSection from "./NoDepositPaymentSection";

const PublicQuotesStep = () => {
  const [customerSignatureDataUrl, setCustomerSignatureDataUrl] = useState<
    string | null
  >(null);
  const { move } = usePublicMoveIdContext();
  const { quote, company, policy, move: moveData } = move;

  const hasPayment =
    moveData.deposit !== undefined &&
    moveData.deposit > 0 &&
    moveData.paymentMethod?.kind === "credit_card";

  const showQuoteActions =
    customerSignatureDataUrl !== null && quote?.status !== "completed";

  if (quote === null) {
    return null;
  }

  return (
    <SectionContainer showBorder={false} className="p-0 pb-10">
      <QuoteSummary move={moveData} company={company} />
      <QuoteContactProvider />
      <EditableQuoteSection />
      <QuoteCost move={moveData} />
      <QuoteTerms policy={policy} />

      <QuoteSignature
        quote={quote}
        setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
        customerCollapsible={false}
      />

      {showQuoteActions && hasPayment && (
        <CustomerQuoteSignature
          quoteId={quote._id}
          customerSignatureDataUrl={customerSignatureDataUrl}
        />
      )}

      {showQuoteActions && !hasPayment && (
        <NoDepositPaymentSection
          move={moveData}
          signatureDataUrl={customerSignatureDataUrl}
        />
      )}

      {hasPayment && quote?.status === "completed" && (
        <DepositPaymentSection move={moveData} />
      )}
    </SectionContainer>
  );
};

export default PublicQuotesStep;
