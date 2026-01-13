"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Doc } from "@/convex/_generated/dataModel";
import { useSignQuote } from "@/hooks/quotes/useSignQuote";

interface DepositPaymentSectionProps {
  move: Doc<"moves">;
  signatureDataUrl: string | null;
}

const DepositPaymentSection = ({
  move,
  signatureDataUrl,
}: DepositPaymentSectionProps) => {
  const isDisabled = !signatureDataUrl;
  const { signQuote, signQuoteLoading, signQuoteError } = useSignQuote();
  // const hasDeposit = Number(move.deposit ?? 0) > 0;

  const handleConfirm = async () => {
    if (!signatureDataUrl) {
      return;
    }
    await signQuote(move._id, signatureDataUrl);
  };
  // if (!hasDeposit) {
  return (
    <SingleFormAction
      disabled={isDisabled}
      submitLabel="Confirm"
      onSubmit={handleConfirm}
      isSubmitting={signQuoteLoading}
      error={signQuoteError}
      submitVariant="default"
    />
  );
};

export default DepositPaymentSection;
