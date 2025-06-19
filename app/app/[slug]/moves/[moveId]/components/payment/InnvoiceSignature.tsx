"use client";

import DisplaySignature from "@/app/components/move/shared/DisplaySignature";
import Signature from "@/app/components/move/shared/Signature";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import FormActions from "@/app/components/shared/FormActions";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { InvoiceSchema, MoveSchema } from "@/types/convex-schemas";
import React, { useState } from "react";
import { useCreateOrUpdateInvoice } from "../../../hooks/useCreateOrUpdateInvoice";

interface InvoiceSignatureProps {
  invoice: InvoiceSchema | null;
  move: MoveSchema;
}

const InvoiceSignature = ({ invoice, move }: InvoiceSignatureProps) => {
  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null
  );
  const [isEmailing, setIsEmailing] = useState<boolean>(false);
  const [isTexting, setIsTexting] = useState<boolean>(false);
  const { createOrUpdateInvoice, invoiceUpdateLoading, invoiceUpdateError } =
    useCreateOrUpdateInvoice();

  const { repSignature, repSignedAt } = invoice || {};
  const showRepSignature = !!repSignature;

  const isDisabled = !showRepSignature && !signatureDataUrl;

  const handelEmailInvoice = () => {
    setIsEmailing(true);
    if (signatureDataUrl) {
      createOrUpdateInvoice({
        moveId: move._id,
        updates: { repSignature: signatureDataUrl },
      });
    }
    setIsEmailing(false);
  };
  const handelTextInvoice = () => {
    setIsTexting(true);
    if (signatureDataUrl) {
      createOrUpdateInvoice({
        moveId: move._id,
        updates: { repSignature: signatureDataUrl },
      });
    }
    setIsTexting(false);
  };

  return (
    <div>
      <SectionHeader title="Invoice Signature" />
      <SectionContainer>
        {showRepSignature ? (
          <DisplaySignature
            image={repSignature || ""}
            timestamp={repSignedAt || 0}
            alt="Rep Signature"
            title="Sales Rep Signature"
          />
        ) : (
          <Signature onChange={setSignatureDataUrl} />
        )}
        <FormActions
          onCancel={handelEmailInvoice}
          onSave={handelTextInvoice}
          isSaving={isTexting}
          isCanceling={isEmailing}
          error={invoiceUpdateError}
          saveLabel="Text"
          cancelLabel="Email"
          disabled={isDisabled}
          cancelDisabled={isDisabled}
        />
      </SectionContainer>
    </div>
  );
};

export default InvoiceSignature;
