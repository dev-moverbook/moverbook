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
  setLoading: (loading: boolean) => void;
}

const ProceedButton = ({
  setMoveCustomerStripeProfile,
  moveId,
  paymentError,
  setLoading,
}: ProceedButtonProps) => {
  const {
    ensureMoveCustomerStripeProfile,
    error,
    loading,
  } = useEnsureMoveCustomerStripeProfiel();

  const handleClick = async () => {
    setLoading(true);
    const moveCustomerStripeProfile =
     await ensureMoveCustomerStripeProfile(moveId);

    setMoveCustomerStripeProfile(moveCustomerStripeProfile);
    setLoading(false);
  };


  return (
    <SingleFormAction
      submitLabel="Payment"
      onSubmit={handleClick}
      error={paymentError || error}
      disabled={loading}
    />
  );
};

export default ProceedButton;
