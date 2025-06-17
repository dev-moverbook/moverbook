import React from "react";
import {
  CompanyContactSchema,
  CompanySchema,
  MoveSchema,
  PolicySchema,
  QuoteSchema,
  UserSchema,
} from "@/types/convex-schemas";
import {
  formatServiceTypeLabel,
  getMoveStatusType,
} from "@/app/frontendUtils/helper";
import QuoteHeading from "../quote/QuoteHeading";
import QuoteSummary from "../quote/QuoteSummary";
import QuoteContact from "../quote/QuoteContact";
import QuoteLocation from "../quote/QuoteLocation";
import QuoteInventory from "../quote/QuoteInventory";
import QuoteCost from "../quote/QuoteCost";
import QuoteTerms from "../quote/QuoteTerms";
import QuoteSignature from "../quote/QuoteSignature";
import QuoteActions from "../quote/QuoteActions";

interface QuoteStepProps {
  quote: QuoteSchema | null;
  move: MoveSchema;
  company: CompanySchema;
  salesRep: UserSchema;
  companyContact: CompanyContactSchema;
  onEditQuote: () => void;
  policy: PolicySchema;
}

const QuoteStep = ({
  quote,
  move,
  company,
  salesRep,
  companyContact,
  onEditQuote,
  policy,
}: QuoteStepProps) => {
  const moveStatus = getMoveStatusType(move, quote);
  const title = formatServiceTypeLabel(move.serviceType);
  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null
  );
  const isSignaturePresent = !!signatureDataUrl;

  return (
    <div>
      <QuoteHeading moveStatus={moveStatus} title={title} />
      {/* {moveStatus !== "Missing Information" && ( */}
      <>
        <QuoteSummary move={move} company={company} />
        <QuoteContact
          move={move}
          salesRep={salesRep}
          companyContact={companyContact}
        />
        <QuoteLocation move={move} />
        <QuoteInventory move={move} />
        <QuoteCost move={move} />
        <QuoteTerms move={move} policy={policy} />
        <QuoteSignature
          move={move}
          setSignatureDataUrl={setSignatureDataUrl}
          quote={quote}
        />
        <QuoteActions
          onEditQuote={onEditQuote}
          signatureDataUrl={signatureDataUrl}
          moveId={move._id}
        />
      </>
      {/* )} */}
    </div>
  );
};

export default QuoteStep;
