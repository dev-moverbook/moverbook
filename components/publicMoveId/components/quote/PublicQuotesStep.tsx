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

  // 1. Determine if a deposit is required via credit card
  const hasPayment =
    moveData.deposit !== undefined &&
    moveData.deposit > 0 &&
    moveData.paymentMethod?.kind === "credit_card";

  // 3. Determine if the signature has been drawn but not yet saved/submitted
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

      {/* Signature Pad */}
      <QuoteSignature
        quote={quote}
        setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
      />

      {/* --- MUTUALLY EXCLUSIVE ACTIONS --- */}

      {/* 1. Show standard signature save ONLY if there IS a payment required */}
      {showQuoteActions && hasPayment && (
        <CustomerQuoteSignature
          quoteId={quote._id}
          customerSignatureDataUrl={customerSignatureDataUrl}
        />
      )}

      {/* 2. Show no-deposit finalize ONLY if there is NO payment required */}
      {showQuoteActions && !hasPayment && (
        <NoDepositPaymentSection
          move={moveData}
          signatureDataUrl={customerSignatureDataUrl}
        />
      )}

      {/* ---------------------------------- */}

      {/* 3. Payment form shows after standard signature is saved */}
      {hasPayment && <DepositPaymentSection move={moveData} />}
    </SectionContainer>
  );
};

export default PublicQuotesStep;
