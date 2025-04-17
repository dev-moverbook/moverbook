import { STRIPE_API_VERSION } from "@/types/const";
import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";

if (!process.env.STRIPE_KEY) {
  throw new Error(ErrorMessages.ENV_NOT_SET_STRIPE_KEY);
}
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

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
