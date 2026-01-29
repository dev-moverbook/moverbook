"use client";

import { useState, useEffect, useMemo } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { StripePaymentForm } from "./StripePaymentForm";
import { useStripeSetupIntent, useStripePaymentIntent } from "@/hooks/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { getStripePromise } from "@/frontendUtils/stripe";
import ProceedButton from "./ProceedButton";
import { getDefaultPaymentMethodInfo } from "./helper";
import PaymentSkeleton from "@/components/shared/skeleton/PaymentSkeleton";
import { stripeDarkAppearance } from "@/frontendUtils/stripeTheme";

interface PaymentWrapperProps {
  amount: number;
  moveId: Id<"moves">;
  error?: string | null;
  type: "deposit" | "final_payment";
}

export default function PaymentWrapper({
  amount,
  moveId,
  error,
  type,
}: PaymentWrapperProps) {
  const [loading, setLoading] = useState<boolean>(false);
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

  const [setupClientSecret, setSetupClientSecret] = useState<string | null>(
    null
  );

  // Fetch SetupIntent clientSecret early
  useEffect(() => {
    if (
      moveCustomerStripeProfile &&
      !setupClientSecret &&
      !setupLoading &&
      !setupError
    ) {
      const fetchSecret = async () => {
        try {
          const { clientSecret } = await createSetupIntent(moveId);
          setSetupClientSecret(clientSecret);
        } catch (err) {
          console.error("Failed to create SetupIntent:", err);
        }
      };
      fetchSecret();
    }
  }, [
    moveCustomerStripeProfile,
    setupClientSecret,
    createSetupIntent,
    moveId,
    setupLoading,
    setupError,
  ]);

  const cardInfo = getDefaultPaymentMethodInfo(moveCustomerStripeProfile);

  const stripePromise = useMemo(() => {
    return moveCustomerStripeProfile?.stripeConnectedAccountId
      ? getStripePromise(moveCustomerStripeProfile.stripeConnectedAccountId)
      : null;
  }, [moveCustomerStripeProfile?.stripeConnectedAccountId]);


  if (!moveCustomerStripeProfile || error) {
    return (
      <ProceedButton
        setMoveCustomerStripeProfile={setMoveCustomerStripeProfile}
        moveId={moveId}
        paymentError={error}
        setLoading={setLoading}
      />
    );
  }

  if (!setupClientSecret || loading) {
    return (
      <PaymentSkeleton />
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret: setupClientSecret, appearance: stripeDarkAppearance }}
      key={moveCustomerStripeProfile.stripeConnectedAccountId}
    >
      <StripePaymentForm
        amount={amount}
        cardInfo={cardInfo}
        createPaymentIntent={async ({
          useSavedPaymentMethod,
          manualPaymentMethodId,
        }) => {
          await createPaymentIntent(moveId, type, {
            useSavedPaymentMethod,
            manualPaymentMethodId,
          });
        }}
        error={error || setupError || paymentError}
        isLoading={setupLoading || paymentLoading}
      />
    </Elements>
  );
}
