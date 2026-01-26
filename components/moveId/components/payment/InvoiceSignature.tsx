"use client";

import { useState } from "react";
import DisplaySignature from "@/components/move/shared/DisplaySignature";
import Signature from "@/components/move/shared/Signature";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { useCreateOrUpdateInvoice } from "@/hooks/invoices";
import { Doc } from "@/convex/_generated/dataModel";
import { useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";
import FormActions from "@/components/shared/buttons/FormActions";

interface InvoiceSignatureProps {
  invoice: Doc<"invoices"> | null;
  move: Doc<"moves">;
  salesRepSignatureDataUrl: string | null;
  setCustomerSignatureDataUrl: (dataUrl: string | null) => void;
  setSalesRepSignatureDataUrl: (dataUrl: string | null) => void;
}

const InvoiceSignature = ({
  invoice,
  move,
  salesRepSignatureDataUrl,
  setCustomerSignatureDataUrl,
  setSalesRepSignatureDataUrl,
}: InvoiceSignatureProps) => {
  const [isEmailing, setIsEmailing] = useState<boolean>(false);
  const [isTexting, setIsTexting] = useState<boolean>(false);

  const { createOrUpdateInvoice, invoiceUpdateError } =
    useCreateOrUpdateInvoice();

  const { sendPresetScript, sendPresetScriptError } = useSendPresetScript();

  const { repSignature, repSignedAt, customerSignature, customerSignedAt } =
    invoice || {};
  const showRepSignature = !!repSignature;

  const isDisabled = !showRepSignature && !salesRepSignatureDataUrl;
  const isComplete = invoice?.status === "completed" && !!repSignature;

  const showCustomerSignature = !!customerSignature;

  const showActions = invoice?.status !== "completed";

  const handleEmailInvoice = async () => {
    setIsEmailing(true);
    if (salesRepSignatureDataUrl) {
      await createOrUpdateInvoice({
        moveId: move._id,
        updates: { repSignature: salesRepSignatureDataUrl },
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
    if (salesRepSignatureDataUrl) {
      await createOrUpdateInvoice({
        moveId: move._id,
        updates: { repSignature: salesRepSignatureDataUrl },
      });
    }
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: PresSetScripts.SMS_INVOICE,
    });
    setIsTexting(false);
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
            onChange={setSalesRepSignatureDataUrl}
          />
        )}
        {showCustomerSignature ? (
          <DisplaySignature
            image={customerSignature || ""}
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
        {showActions && (
          <FormActionContainer>
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleEmailInvoice();
              }}
              onCancel={handleTextInvoice}
              saveLabel="Email"
              cancelLabel="Text"
              isSaving={isEmailing}
              isCanceling={isTexting}
              error={invoiceUpdateError || sendPresetScriptError}
              disabled={isDisabled}
              cancelDisabled={isDisabled}
            />
          </FormActionContainer>
        )}
      </SectionContainer>
    </div>
  );
};

export default InvoiceSignature;
