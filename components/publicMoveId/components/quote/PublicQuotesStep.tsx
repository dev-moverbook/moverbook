"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import QuoteStatus from "../../../moveId/components/quote/QuoteStatus";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { getPublicQuoteStatus } from "@/frontendUtils/tsxHelper";
import QuoteSummary from "@/components/moveId/components/quote/QuoteSummary";
import QuoteContact from "@/components/moveId/components/quote/QuoteContact";
import QuoteLocation from "@/components/moveId/components/quote/QuoteLocation";
import QuoteInventory from "@/components/moveId/components/quote/QuoteInventory";
import QuoteCost from "@/components/moveId/components/quote/QuoteCost";
import QuoteTerms from "@/components/moveId/components/quote/QuoteTerms";
import QuoteSignature from "@/components/moveId/components/quote/QuoteSignature";
import { useState } from "react";
import DepositPaymentSection from "./DepositPaymentSection";

const PublicQuotesStep = () => {
  const [customerSignatureDataUrl, setCustomerSignatureDataUrl] = useState<
    string | null
  >(null);
  const { move } = usePublicMoveIdContext();
  const {
    quote,
    company,
    companyContact,
    moveCustomer,
    salesRepUser,
    policy,
    move: moveData,
  } = move;
  const quoteStatus = getPublicQuoteStatus(quote);
  return (
    <SectionContainer showBorder={false} className="px-0">
      <QuoteStatus quoteStatus={quoteStatus} />
      <QuoteSummary move={moveData} company={company} />
      <QuoteContact
        companyContact={companyContact}
        moveCustomer={moveCustomer}
        salesRepUser={salesRepUser}
      />
      <QuoteLocation move={moveData} />
      <QuoteInventory move={moveData} />
      <QuoteCost move={moveData} />
      <QuoteTerms policy={policy} />
      <QuoteSignature
        quote={quote}
        setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
      />
      <DepositPaymentSection
        move={moveData}
        signatureDataUrl={customerSignatureDataUrl}
      />
    </SectionContainer>
  );
};

export default PublicQuotesStep;
