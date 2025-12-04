import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { StripeAccountStatus } from "@/types/enums";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { serverEnv } from "./serverEnv";
import { ActionCtx } from "../_generated/server";

export async function verifyStripeConnectedWebhook(
  rawBody: string,
  signature: string
): Promise<Stripe.Event> {
  const { STRIPE_CONNECTED_WEBHOOK_SECRET } = serverEnv();
  const secret = STRIPE_CONNECTED_WEBHOOK_SECRET;

  try {
    return await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      secret
    );
  } catch (error) {
    console.error("Webhook verification failed:", error);
    throw new Error("Invalid Stripe webhook signature");
  }
}

export function getConnectedAccountStatus(
  account: Stripe.Account
): StripeAccountStatus {
  switch (true) {
    case !!(
      account.requirements?.errors && account.requirements.errors.length > 0
    ):
      return StripeAccountStatus.PENDING;
    case account.charges_enabled && account.payouts_enabled:
      return StripeAccountStatus.VERIFIED;
    default:
      return StripeAccountStatus.NOT_ONBOARDED;
  }
}

export const handleAccountUpdated = async (
  ctx: ActionCtx,
  account: Stripe.Account
) => {
  try {
    const customerId = account.metadata?.customerId;

    if (!customerId) {
      throw new Error(ErrorMessages.CONNECTED_ACCOUNT_NO_CUSTOMER_ID);
    }

    const status = getConnectedAccountStatus(account);

    await ctx.runMutation(internal.connectedAccounts.saveConnectedAccount, {
      customerId: customerId as Id<"customers">,
      stripeAccountId: account.id,
      status,
    });
  } catch (error) {
    console.error(ErrorMessages.CONNECTED_ACCOUNT_UPDATE_ERROR, error);
    throw new Error(ErrorMessages.CONNECTED_ACCOUNT_UPDATE_ERROR);
  }
};
