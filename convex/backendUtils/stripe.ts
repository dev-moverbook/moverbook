import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";

export async function createStripeConnectedAccount({
  email,
  customerId,
}: {
  email: string;
  customerId: string;
}): Promise<Stripe.Account> {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      metadata: {
        customerId,
      },
    });

    return account;
  } catch (error) {
    console.error(ErrorMessages.STRIPE_CREATE, error);
    throw new Error(ErrorMessages.STRIPE_CREATE);
  }
}

type StripeAccountLinkType = "account_onboarding" | "account_update";

export async function generateStripeAccountLink({
  accountId,
  type = "account_onboarding",
  returnUrl,
  refreshUrl,
}: {
  accountId: string;
  type?: StripeAccountLinkType;
  returnUrl: string;
  refreshUrl: string;
}): Promise<string> {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type,
    });

    return accountLink.url;
  } catch (error) {
    console.error(ErrorMessages.STRIPE_CONNECTED_ONBOARDING_LINK, error);
    throw new Error(ErrorMessages.STRIPE_CONNECTED_ONBOARDING_LINK);
  }
}

export async function generateStripeAccountLoginLink({
  accountId,
}: {
  accountId: string;
}): Promise<string> {
  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return loginLink.url;
  } catch (error) {
    console.error(ErrorMessages.STRIPE_CONNECTED_LOGIN_LINK, error);
    throw new Error(ErrorMessages.STRIPE_CONNECTED_LOGIN_LINK);
  }
}

// export async function deactivateStripeConnectedAccount(
//   stripeAccountId: string
// ): Promise<void> {
// try {
//   await stripe.accounts.update(stripeAccountId, { capabilities: {} });
// } catch (error) {
//   console.error(
//     `Failed to delete Stripe connected account ${stripeAccountId}:`,
//     error
//   );
//   throw new Error(ErrorMessages.STRIPE_CONNECTED_DEACTIVATE_ERROR);
// }
