import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";
import { stripe } from "./stripe";
import { StripeAccountStatus } from "@/types/enums";
import { GenericActionCtx } from "convex/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

export async function verifyStripeConnectedWebhook(
  rawBody: string,
  signature: string
): Promise<Stripe.Event> {
  const secret = process.env.STRIPE_CONNECTED_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Stripe connected account webhook secret is not configured!");
    throw new Error(ErrorMessages.ENV_NOT_SET_STRIPE_CONNECTED_WEBHOOK_SECRET);
  }

  try {
    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      secret
    );
    return event;
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
  ctx: GenericActionCtx<any>,
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
    throw new Error(ErrorMessages.CONNECTED_ACCOUNT_UPDATE_ERROR);
  }
};
