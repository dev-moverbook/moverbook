"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { StripePaymentForm } from "./StripePaymentForm";
import { useStripePaymentIntent, useStripeSetupIntent } from "@/hooks/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { getStripePromise } from "@/frontendUtils/stripe";
import { useMemo, useState } from "react";
import ProceedButton from "./ProceedButton";
import { getDefaultPaymentMethodInfo } from "./helper";

interface PaymentWrapperProps {
  amount: number;
  moveId: Id<"moves">;
  error?: string | null;
}

const PaymentWrapper = ({ amount, moveId, error }: PaymentWrapperProps) => {
  const [moveCustomerStripeProfile, setMoveCustomerStripeProfile] =
    useState<Doc<"moveCustomerStripeProfiles"> | null>(null);

  const {
    createSetupIntent,
    loading: setupLoading,
    error: setupError,
  } = useStripeSetupIntent();

  const {
    createPaymentIntent,
    loading: paymentLoading,
    error: paymentError,
  } = useStripePaymentIntent();

  const cardInfo = getDefaultPaymentMethodInfo(moveCustomerStripeProfile);

  const stripePromise = useMemo(() => {
    return getStripePromise(
      moveCustomerStripeProfile?.stripeConnectedAccountId
    );
  }, [moveCustomerStripeProfile?.stripeConnectedAccountId]);

  if (moveCustomerStripeProfile === null || error) {
    return (
      <ProceedButton
        setMoveCustomerStripeProfile={setMoveCustomerStripeProfile}
        moveId={moveId}
        paymentError={error}
      />
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        amount={amount}
        cardInfo={cardInfo}
        createSetupIntent={() => createSetupIntent(moveId)}
        createPaymentIntent={async ({
          useSavedPaymentMethod,
          manualPaymentMethodId,
        }) => {
          await createPaymentIntent(moveId, "deposit", {
            useSavedPaymentMethod,
            manualPaymentMethodId,
          });
        }}
        error={error || setupError || paymentError}
        isLoading={setupLoading || paymentLoading}
      />
    </Elements>
  );
};

export default PaymentWrapper;
