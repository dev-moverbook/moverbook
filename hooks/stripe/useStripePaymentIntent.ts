import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { useAction } from "convex/react";
import { useState } from "react";

type PaymentIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "requires_capture"
  | "canceled"
  | "succeeded";

export const useStripePaymentIntent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const action = useAction(api.actions.stripe.createPaymentIntent);

  const createPaymentIntent = async (
    moveId: Id<"moves">,
    type: "deposit" | "final_payment",
    options?: {
      useSavedPaymentMethod: boolean;
      manualPaymentMethodId?: string;
    }
  ): Promise<{ paymentIntentId: string; status: PaymentIntentStatus }> => {
    setLoading(true);
    setError(null);

    try {
      return await action({
        moveId,
        type,
        manualPaymentMethodId: options?.manualPaymentMethodId,
      });
    } catch (err) {
      setErrorFromConvexError(err, setError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentIntent,
    loading,
    error,
  };
};
