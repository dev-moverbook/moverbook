import { useState, useCallback } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export function useStripePayment({
  createSetupIntent,
  createPaymentIntent,
}: {
  createSetupIntent: () => Promise<{ clientSecret: string }>;
  createPaymentIntent: (args: {
    useSavedPaymentMethod: boolean;
    manualPaymentMethodId?: string; // Added to handle new cards immediately
  }) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [setupClientSecret, setSetupClientSecret] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ensures we have a SetupIntent client secret from the backend.
   * We cache this in state so we don't create multiple intents for one session.
   */
  const ensureSetupIntent = useCallback(async () => {
    if (setupClientSecret) {
      return setupClientSecret;
    }
    const res = await createSetupIntent();
    setSetupClientSecret(res.clientSecret);
    return res.clientSecret;
  }, [setupClientSecret, createSetupIntent]);

  /**
   * Handles the submission of either a saved card or a brand new card.
   */
  const submit = useCallback(
    async (selection: "saved" | "new") => {
      setError(null);
      setLoading(true);

      try {
        // CASE 1: User selected an existing card on file
        if (selection === "saved") {
          await createPaymentIntent({ useSavedPaymentMethod: true });
          return;
        }

        // CASE 2: User is entering a new card
        if (!stripe || !elements) {
          throw new Error("Stripe.js has not loaded yet. Please try again.");
        }

        const clientSecret = await ensureSetupIntent();
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          throw new Error("Card input field not found.");
        }

        // Confirm the setup with Stripe
        // This attaches the payment method to the Customer object in Stripe
        const { error: stripeError, setupIntent } =
          await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
              card: cardElement,
            },
          });

        if (stripeError) {
          throw stripeError;
        }

        if (!setupIntent || !setupIntent.payment_method) {
          throw new Error(
            "Setup failed: No payment method returned from Stripe."
          );
        }

        // SUCCESS: We now have a fresh PaymentMethod ID (pm_...)
        // We pass this ID directly to our backend to create the PaymentIntent.
        // This avoids the race condition of waiting for a webhook!
        await createPaymentIntent({
          useSavedPaymentMethod: false,
          manualPaymentMethodId: setupIntent.payment_method as string,
        });
      } catch (err) {
        // Standardize error handling from Convex or Stripe
        setErrorFromConvexError(err, setError);
      } finally {
        setLoading(false);
      }
    },
    [stripe, elements, ensureSetupIntent, createPaymentIntent]
  );

  return {
    submit,
    loading,
    error,
    hasSetupIntent: !!setupClientSecret,
  };
}
