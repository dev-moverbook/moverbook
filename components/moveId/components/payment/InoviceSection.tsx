"use client";

import { Doc } from "@/convex/_generated/dataModel";
import ExternalReview from "./ExternalReview";
import InternalReview from "./InternalReview";
import InvoiceSignature from "./InvoiceSignature";
import InvoiceSummary from "./InvoiceSummary";
import { CostFormat } from "@/types/types";
import { useState } from "react";
import InvoiceConfirmation from "./InvoiceConfirmation";

interface InoviceSectionProps {
  items: CostFormat[];
  total: number;
  invoice: Doc<"invoices"> | null;
  move: Doc<"moves">;
  internalReview: Doc<"internalReviews"> | null;
}

const InoviceSection = ({
  items,
  total,
  invoice,
  move,
  internalReview,
}: InoviceSectionProps) => {
  const [customerSignatureDataUrl, setCustomerSignatureDataUrl] = useState<
    string | null
  >(null);
  const [salesRepSignatureDataUrl, setSalesRepSignatureDataUrl] = useState<
    string | null
  >(null);

  return (
    <>
      <InvoiceSummary items={items} total={total} />
      <InvoiceSignature
        salesRepSignatureDataUrl={salesRepSignatureDataUrl}
        setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
        setSalesRepSignatureDataUrl={setSalesRepSignatureDataUrl}
        invoice={invoice}
        move={move}
      />
      <InvoiceConfirmation
        customerSignatureDataUrl={customerSignatureDataUrl}
        salesRepSignatureDataUrl={salesRepSignatureDataUrl}
        move={move}
        amount={total}
      />
      <InternalReview internalReview={internalReview} move={move} />
      <ExternalReview move={move} />
    </>
  );
};

export default InoviceSection;
