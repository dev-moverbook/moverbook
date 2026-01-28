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
  const [salesRepSignatureDataUrl, setSalesRepSignatureDataUrl] = useState<
    string | null
  >(null);
  const [customerSignatureDataUrl, setCustomerSignatureDataUrl] = useState<
    string | null
  >(null);
  const { company } = moveData;
  const { companyContact, moveCustomer, salesRepUser, policy } = moveData;
  const quoteStatus = getQuoteStatusInfo(quote, move.moveStatus);

  return (
    <SectionContainer showBorder={false} className="px-0 pt-0">
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
        <QuoteSummary move={move} company={company} />
        <QuoteContact
          companyContact={companyContact}
          moveCustomer={moveCustomer}
          salesRepUser={salesRepUser}
        />
        <QuoteLocation move={move} />
        <QuoteInventory move={move} />
        <QuoteCost move={move} />
        <QuoteTerms policy={policy} />
        <QuoteSignature
          quote={quote}
          setSalesRepSignatureDataUrl={setSalesRepSignatureDataUrl}
          setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
        />
        {(salesRepSignatureDataUrl || quote?.repSignature) && (
          <QuoteActions
            salesRepSignatureDataUrl={salesRepSignatureDataUrl}
            customerSignatureDataUrl={customerSignatureDataUrl}
            onSuccess={() => {
              setSalesRepSignatureDataUrl(null);
              setCustomerSignatureDataUrl(null);
            }}
          />
        )}
      </>
    </SectionContainer>
  );
};

export default QuoteStep;
