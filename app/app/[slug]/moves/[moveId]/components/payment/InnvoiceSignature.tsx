"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";

const InvoiceSignature = ({}: {}) => {
  return (
    <div>
      <SectionHeader title="Invoice Signature" />
      <SectionContainer>
        <div className="flex flex-col gap-4">
          <p>Placeholder</p>
        </div>
      </SectionContainer>
    </div>
  );
};

export default InvoiceSignature;
