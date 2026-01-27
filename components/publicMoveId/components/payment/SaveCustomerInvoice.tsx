"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useUpdateCustomerInvoice } from "@/hooks/invoices";

interface SaveCustomerInvoiceProps {
  signature: string;
  setSignatureDataUrl: (dataUrl: string | null) => void;
  invoiceId: Id<"invoices">;
}

const SaveCustomerInvoice = ({
  invoiceId,
  signature,
  setSignatureDataUrl,
}: SaveCustomerInvoiceProps) => {
  const { updateCustomerInvoice, error, loading } = useUpdateCustomerInvoice();

  const handleSubmit = async () => {
    const success = await updateCustomerInvoice({
      invoiceId,
      updates: { customerSignature: signature, status: "completed" },
    });
    if (success) {
      setSignatureDataUrl(null);
    }
  };
  return (
    <SingleFormAction
      submitLabel="Save"
      onSubmit={handleSubmit}
      isSubmitting={loading}
      error={error}
    />
  );
};

export default SaveCustomerInvoice;
