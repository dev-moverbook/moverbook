import { loadStripe } from "@stripe/stripe-js";
import { clientEnv } from "./clientEnv";

const { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } = clientEnv();

export function getStripePromise(connectedAccountId?: string) {
  if (!connectedAccountId) {
    return loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
    stripeAccount: connectedAccountId,
  });
}
