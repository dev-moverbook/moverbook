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
  const { ensureMoveCustomerStripeProfile, loading, error } =
    useEnsureMoveCustomerStripeProfiel();
  const handleClick = async () => {
    const moveCustomerStripeProfile =
      await ensureMoveCustomerStripeProfile(moveId);
    setMoveCustomerStripeProfile(moveCustomerStripeProfile);
  };
  return (
    <SingleFormAction
      onSubmit={handleClick}
      isSubmitting={loading}
      error={error || paymentError}
      submitLabel="Proceed With Payment"
    />
  );
};

export default ProceedButton;
