"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useEnsureMoveCustomerStripeProfiel } from "@/hooks/stripe";

interface ProceedButtonProps {
  setMoveCustomerStripeProfile: (
    moveCustomerStripeProfile: Doc<"moveCustomerStripeProfiles">
  ) => void;
  moveId: Id<"moves">;
  paymentError?: string | null;
}

const ProceedButton = ({
  setMoveCustomerStripeProfile,
  moveId,
  paymentError,
}: ProceedButtonProps) => {
  const {
    ensureMoveCustomerStripeProfile,
    loading: ensureMoveCustomerStripeProfileLoading,
    error: ensureMoveCustomerStripeProfileError,
  } = useEnsureMoveCustomerStripeProfiel();

  const handleClick = async () => {
    const moveCustomerStripeProfile =
      await ensureMoveCustomerStripeProfile(moveId);
    setMoveCustomerStripeProfile(moveCustomerStripeProfile);
  };

  const isSubmitting = ensureMoveCustomerStripeProfileLoading;

  return (
    <SingleFormAction
      submitLabel="Payment"
      onSubmit={handleClick}
      isSubmitting={isSubmitting}
      error={paymentError || ensureMoveCustomerStripeProfileError}
    />
  );
};

export default ProceedButton;
