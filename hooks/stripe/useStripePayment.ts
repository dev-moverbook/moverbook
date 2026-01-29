"use client";

import { useState, useCallback } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export function useStripePayment({
  createPaymentIntent,
}: {
  createPaymentIntent: (args: {
    useSavedPaymentMethod: boolean;
    manualPaymentMethodId?: string;
  }) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (selection: "saved" | "new") => {
      setError(null);
      setLoading(true);

      try {
        if (selection === "saved") {
          await createPaymentIntent({ useSavedPaymentMethod: true });
          return;
        }

        if (!stripe || !elements) {
          throw new Error("Stripe or Elements not loaded. Please refresh.");
        }

        // First submit any pending form validation (important for PaymentElement)
        await elements.submit();

        const { error: stripeError, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            // Add return_url only if you expect redirect-based authentication
            // return_url: `${window.location.origin}/payment/return`,
          },
          redirect: "if_required", // Most card saves don't need redirect
        });

        if (stripeError) {
          console.error("Stripe confirmSetup error:", stripeError);
          throw stripeError;
        }

        if (!setupIntent?.payment_method) {
          throw new Error("No payment method returned from setup.");
        }

        await createPaymentIntent({
          useSavedPaymentMethod: false,
          manualPaymentMethodId: setupIntent.payment_method as string,
        });
      } catch (err) {
        setErrorFromConvexError(err, setError);
      } finally {
        setLoading(false);
      }
    },
    [stripe, elements, createPaymentIntent]
  );

  return { submit, loading, error };
}
