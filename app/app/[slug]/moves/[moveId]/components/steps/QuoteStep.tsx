import React from "react";
import {
  CompanyContactSchema,
  CompanySchema,
  PolicySchema,
} from "@/types/convex-schemas";
import { formatServiceTypeLabel } from "@/app/frontendUtils/helper";
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
import { getQuoteStatusInfo } from "@/app/frontendUtils/tsxHelper";

interface QuoteStepProps {
  quote: Doc<"quotes"> | null;
  move: Doc<"move">;
  company: Doc<"companies">;
  salesRep: Doc<"users"> | null;
  companyContact: Doc<"companyContact">;
  onEditQuote: () => void;
  policy: Doc<"policies">;
  moveCustomer: Doc<"moveCustomers">;
}

const QuoteStep = ({
  quote,
  move,
  company,
  salesRep,
  companyContact,
  onEditQuote,
  policy,
  moveCustomer,
}: QuoteStepProps) => {
  const title = formatServiceTypeLabel(move.serviceType);
  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null
  );

  const quoteStatus = getQuoteStatusInfo(quote);

  return (
    <div>
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
          moveCustomer={moveCustomer}
          salesRep={salesRep}
          companyContact={companyContact}
        />
        <QuoteLocation move={move} />
        <QuoteInventory move={move} />
        <QuoteCost move={move} />
        <QuoteTerms policy={policy} />
        <QuoteSignature
          move={move}
          setSignatureDataUrl={setSignatureDataUrl}
          quote={quote}
        />
        <QuoteActions
          onEditQuote={onEditQuote}
          signatureDataUrl={signatureDataUrl}
          quote={quote}
          move={move}
        />
      </>
      {/* )} */}
    </div>
  );
};

export default QuoteStep;
