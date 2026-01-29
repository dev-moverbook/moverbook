"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useCreateOrUpdateInvoice } from "@/hooks/invoices";

interface InvoiceSaveProps {
  moveId: Id<"moves">;
  invoice: Doc<"invoices"> | null;
  salesRepSignatureDataUrl: string | null;
  customerSignatureDataUrl: string | null;
  onSuccess: () => void;
}

const InvoiceSave = ({
  moveId,
  invoice,
  salesRepSignatureDataUrl,
  customerSignatureDataUrl,
  onSuccess,
}: InvoiceSaveProps) => {
  const { createOrUpdateInvoice, error, loading } = useCreateOrUpdateInvoice();

  const handleSave = async () => {
    const hasRep = !!invoice?.repSignature || !!salesRepSignatureDataUrl;
    const hasCustomer =
      !!invoice?.customerSignature || !!customerSignatureDataUrl;

    const finalStatus = hasRep && hasCustomer ? "completed" : "pending";

    const success = await createOrUpdateInvoice({
      moveId,
      updates: {
        ...(salesRepSignatureDataUrl && {
          repSignature: salesRepSignatureDataUrl,
        }),
        ...(customerSignatureDataUrl && {
          customerSignature: customerSignatureDataUrl,
        }),
        status: finalStatus,
      },
    });

    if (success) {
      onSuccess();
    }
  };

  return (
    <FormActionContainer>
      <SingleFormAction
        onSubmit={handleSave}
        submitLabel="Save"
        isSubmitting={loading}
        error={error}
      />
    </FormActionContainer>
  );
};

export default InvoiceSave;
