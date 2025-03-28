import { STRIPE_API_VERSION } from "@/types/const";
import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";

if (!process.env.STRIPE_KEY) {
  throw new Error(ErrorMessages.ENV_NOT_SET_STRIPE_KEY);
}
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

export async function deactivateStripeConnectedAccount(
  stripeAccountId: string
): Promise<void> {
  try {
    await stripe.accounts.update(stripeAccountId, { capabilities: {} });
  } catch (error) {
    console.error(
      `Failed to delete Stripe connected account ${stripeAccountId}:`,
      error
    );
    throw new Error(ErrorMessages.STRIPE_CONNECTED_DEACTIVATE_ERROR);
  }
}
