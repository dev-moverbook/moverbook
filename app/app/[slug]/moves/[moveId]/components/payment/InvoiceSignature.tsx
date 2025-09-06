"use client";

import React, { useState } from "react";
import DisplaySignature from "@/app/components/move/shared/DisplaySignature";
import Signature from "@/app/components/move/shared/Signature";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import TripleFormAction from "@/app/components/shared/buttons/TripleFormAction";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import { useCreateOrUpdateInvoice } from "../../../hooks/useCreateOrUpdateInvoice";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { Doc } from "@/convex/_generated/dataModel";

interface InvoiceSignatureProps {
  invoice: Doc<"invoices"> | null;
  move: Doc<"move">;
  total: number;
}

const InvoiceSignature = ({ invoice, move, total }: InvoiceSignatureProps) => {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isEmailing, setIsEmailing] = useState<boolean>(false);
  const [isTexting, setIsTexting] = useState<boolean>(false);
  const [isMarkingAsComplete, setIsMarkingAsComplete] =
    useState<boolean>(false);

  const { createOrUpdateInvoice, invoiceUpdateError } =
    useCreateOrUpdateInvoice();
  const { updateMove, updateMoveError } = useUpdateMove();

  const { repSignature, repSignedAt } = invoice || {};
  const showRepSignature = !!repSignature;

  const isDisabled = !showRepSignature && !signatureDataUrl;
  const isComplete = invoice?.status === "completed" && !!repSignature;

  const handleUpdateMoveStatus = async () => {
    if (move.moveStatus !== "Completed") {
      await updateMove({
        moveId: move._id,
        updates: { moveStatus: "Completed", invoiceAmountPaid: total },
      });
    }
  };

  const handleEmailInvoice = async () => {
    setIsEmailing(true);
    if (signatureDataUrl) {
      await createOrUpdateInvoice({
        moveId: move._id,
        updates: { repSignature: signatureDataUrl },
      });
    }
    setIsEmailing(false);
  };

  const handleTextInvoice = async () => {
    setIsTexting(true);
    if (signatureDataUrl) {
      await createOrUpdateInvoice({
        moveId: move._id,
        updates: { repSignature: signatureDataUrl },
      });
    }
    setIsTexting(false);
  };

  const handleMarkAsComplete = async () => {
    setIsMarkingAsComplete(true);

    const updates: Partial<Doc<"invoices">> = {
      status: "completed",

      ...(signatureDataUrl && { repSignature: signatureDataUrl }),
    };

    await createOrUpdateInvoice({ moveId: move._id, updates });
    await handleUpdateMoveStatus();

    setIsMarkingAsComplete(false);
  };

  return (
    <div>
      <SectionHeader
        className="mx-auto"
        title="Invoice Signature"
        showCheckmark
        isCompleted={isComplete}
      />
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

        <FormActionContainer>
          <TripleFormAction
            onPrimary={handleTextInvoice}
            onSecondary={handleEmailInvoice}
            onTertiary={handleMarkAsComplete}
            primaryLoading={isTexting}
            secondaryLoading={isEmailing}
            tertiaryLoading={isMarkingAsComplete}
            error={invoiceUpdateError || updateMoveError}
            disabled={isDisabled}
            primaryDisabled={isDisabled}
            secondaryDisabled={isDisabled}
            tertiaryDisabled={isComplete}
            secondaryVariant="outline"
            tertiaryVariant="outline"
            primaryLabel="Email"
            secondaryLabel="Text"
            tertiaryLabel="Mark as Complete"
          />
        </FormActionContainer>
      </SectionContainer>
    </div>
  );
};

export default InvoiceSignature;
