"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useUpdateQuoteCustomerSignature } from "@/hooks/quotes";

interface CustomerQuoteSignatureProps {
  quoteId: Id<"quotes">;
  customerSignatureDataUrl: string;
}
const CustomerQuoteSignature = ({
  quoteId,
  customerSignatureDataUrl,
}: CustomerQuoteSignatureProps) => {
  const { updateQuoteCustomerSignature, loading, error } =
    useUpdateQuoteCustomerSignature();

  const handleSubmit = async () => {
    await updateQuoteCustomerSignature(quoteId, customerSignatureDataUrl);
  };

  return (
    <SingleFormAction
      submitLabel="Submit"
      onSubmit={handleSubmit}
      isSubmitting={loading}
      error={error}
    />
  );
};

export default CustomerQuoteSignature;
