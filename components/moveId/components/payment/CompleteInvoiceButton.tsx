"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useMarkAsComplete } from "@/hooks/messages";

interface CompleteInvoiceButtonProps {
  moveId: Id<"moves">;
  customerSignatureDataUrl: string | null;
  salesRepSignatureDataUrl: string | null;
}
const CompleteInvoiceButton = ({
  moveId,
  customerSignatureDataUrl,
  salesRepSignatureDataUrl,
}: CompleteInvoiceButtonProps) => {
  const { markAsComplete, isLoading, error } = useMarkAsComplete();

  const handleMarkAsComplete = async () => {
    await markAsComplete({
      moveId,
      customerSignature: customerSignatureDataUrl || undefined,
      salesRepSignature: salesRepSignatureDataUrl || undefined,
      updateInvoice: true,
    });
  };
  return (
    <SingleFormAction
      submitLabel="Mark as Complete"
      onSubmit={handleMarkAsComplete}
      isSubmitting={isLoading}
      error={error}
      submitVariant="default"
    />
  );
};

export default CompleteInvoiceButton;
