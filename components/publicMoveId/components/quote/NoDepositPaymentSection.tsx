"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { useSignQuote } from "@/hooks/quotes";

interface NoDepositPaymentSectionProps {
  move: Doc<"moves">;
  signatureDataUrl: string;
}

const NoDepositPaymentSection = ({
  move,
  signatureDataUrl,
}: NoDepositPaymentSectionProps) => {
  const isDisabled = !signatureDataUrl;
  const { signQuote, signQuoteLoading, signQuoteError } = useSignQuote();

  const handleConfirm = async () => {
    await signQuote(move._id, signatureDataUrl);
  };

  return (
    <div>
      <SectionHeader className="mx-auto" title="Confirmation" />
      <SectionContainer showBorder={false}>
        <SingleFormAction
          disabled={isDisabled}
          submitLabel="Confirm"
          onSubmit={handleConfirm}
          isSubmitting={signQuoteLoading}
          error={signQuoteError}
          submitVariant="default"
        />
      </SectionContainer>
    </div>
  );
};

export default NoDepositPaymentSection;
