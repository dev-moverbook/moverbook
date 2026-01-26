"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useCreateOrUpdateQuote } from "@/hooks/quotes";

interface QuoteSaveProps {
  moveId: Id<"moves">;
  quote: Doc<"quotes"> | null;
  salesRepSignatureDataUrl: string | null;
  customerSignatureDataUrl: string | null;
  onSuccess: () => void;
}

const QuoteSave = ({
  moveId,
  quote,
  salesRepSignatureDataUrl,
  customerSignatureDataUrl,
  onSuccess,
}: QuoteSaveProps) => {
  const { createOrUpdateQuote, error, loading } = useCreateOrUpdateQuote();

  const handleSave = async () => {
    const hasRep = !!quote?.repSignature || !!salesRepSignatureDataUrl;
    const hasCustomer =
      !!quote?.customerSignature || !!customerSignatureDataUrl;

    const finalStatus = hasRep && hasCustomer ? "completed" : "pending";

    const success = await createOrUpdateQuote({
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

export default QuoteSave;
