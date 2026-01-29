"use client";

import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/containers/SectionContainer";

interface InvoiceCustomerSignatureProps {
  invoice: Doc<"invoices">;
  setSignatureDataUrl: (dataUrl: string | null) => void;
}

const InvoiceCustomerSignature = ({
  invoice,
  setSignatureDataUrl,
}: InvoiceCustomerSignatureProps) => {
  const {
    repSignature,
    repSignedAt,
    customerSignature,
    customerSignedAt,
    status,
  } = invoice;
  const isComplete = status === "completed";
  return (
    <div>
      <SectionHeader
        title="Invoice Signature"
        showCheckmark
        isCompleted={isComplete}
      />
      <SectionContainer>
        <DisplaySignature
          image={repSignature || ""}
          timestamp={repSignedAt || 0}
          alt="Rep Signature"
          title="Sales Rep Signature"
        />
        {customerSignature && customerSignedAt ? (
          <DisplaySignature
            image={customerSignature}
            timestamp={customerSignedAt}
            alt="Customer Signature"
            title="Customer Signature"
          />
        ) : (
          <Signature
            title="Customer Signature"
            onChange={setSignatureDataUrl}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default InvoiceCustomerSignature;
