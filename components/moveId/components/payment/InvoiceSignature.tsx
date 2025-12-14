"use client";

import { useState } from "react";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import TripleFormAction from "@/components/shared/buttons/TripleFormAction";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { useCreateOrUpdateInvoice } from "@/hooks/invoices";
import { useUpdateMove } from "@/hooks/moves";
import { Doc } from "@/convex/_generated/dataModel";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";

interface InvoiceSignatureProps {
  invoice: Doc<"invoices"> | null;
  move: Doc<"moves">;
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

  const { sendPresetScript, sendPresetScriptError, setSendPresetScriptError } =
    useSendPresetScript();

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
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.EMAIL_INVOICE,
    });
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
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.SMS_INVOICE,
    });
    setIsTexting(false);
  };

  const handleMarkAsComplete = async () => {
    setSendPresetScriptError(null);
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
          <Signature
            title="Sales Rep Signature"
            onChange={setSignatureDataUrl}
          />
        )}

        <FormActionContainer>
          <TripleFormAction
            onPrimary={handleEmailInvoice}
            onSecondary={handleTextInvoice}
            onTertiary={handleMarkAsComplete}
            primaryLoading={isEmailing}
            secondaryLoading={isTexting}
            tertiaryLoading={isMarkingAsComplete}
            error={
              invoiceUpdateError || updateMoveError || sendPresetScriptError
            }
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
