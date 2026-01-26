"use client";

import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";

interface InvoiceSignatureProps {
  invoice: Doc<"invoices"> | null;
  setCustomerSignatureDataUrl: (dataUrl: string | null) => void;
  setSalesRepSignatureDataUrl: (dataUrl: string | null) => void;
}

const InvoiceSignature = ({
  invoice,
  setCustomerSignatureDataUrl,
  setSalesRepSignatureDataUrl,
}: InvoiceSignatureProps) => {
  const { repSignature, repSignedAt, customerSignature, customerSignedAt } =
    invoice || {};

  const isComplete = invoice?.status === "completed";

  return (
    <div>
      <SectionHeader
        className="mx-auto"
        title="Invoice Signature"
        showCheckmark
        isCompleted={isComplete}
      />
      <SectionContainer showBorder={false}>
        {repSignature ? (
          <DisplaySignature
            image={repSignature}
            timestamp={repSignedAt || 0}
            alt="Rep Signature"
            title="Sales Rep Signature"
          />
        ) : (
          <Signature
            title="Sales Rep Signature"
            onChange={setSalesRepSignatureDataUrl}
          />
        )}

        {customerSignature ? (
          <DisplaySignature
            image={customerSignature}
            timestamp={customerSignedAt || 0}
            alt="Customer Signature"
            title="Customer Signature"
          />
        ) : (
          <Signature
            title="Customer Signature"
            onChange={setCustomerSignatureDataUrl}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default InvoiceSignature;
