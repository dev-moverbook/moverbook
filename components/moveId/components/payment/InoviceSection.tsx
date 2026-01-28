"use client";

import { Doc } from "@/convex/_generated/dataModel";
import ExternalReview from "./ExternalReview";
import InternalReview from "./InternalReview";
import InvoiceSignature from "./InvoiceSignature";
import InvoiceSummary from "./InvoiceSummary";
import { CostFormat } from "@/types/types";
import { useState } from "react";
import InvoiceActions from "./InvoiceActions";

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
    <div>
      <InvoiceSummary items={items} total={total} />
      <InvoiceSignature
        setCustomerSignatureDataUrl={setCustomerSignatureDataUrl}
        setSalesRepSignatureDataUrl={setSalesRepSignatureDataUrl}
        invoice={invoice}
      />
      {
        <InvoiceActions
          salesRepSignatureDataUrl={salesRepSignatureDataUrl}
          customerSignatureDataUrl={customerSignatureDataUrl}
          invoice={invoice}
          onSuccess={() => {
            setSalesRepSignatureDataUrl(null);
            setCustomerSignatureDataUrl(null);
          }}
          amount={total}
        />
      }
      {move.moveStatus === "Completed" && (
        <>
          <InternalReview internalReview={internalReview} move={move} />
          {internalReview?.rating && <ExternalReview move={move} />}
        </>
      )}
    </div>
  );
};

export default InoviceSection;
