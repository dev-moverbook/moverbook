import Stripe from "stripe";
import { Id } from "../_generated/dataModel";
import { stripe } from "../lib/stripe";

export async function createOffSessionPaymentIntent({
  amount,
  customerId,
  paymentMethodId,
  connectedAccountId,
  description,
  metadata,
}: {
  amount: number;
  customerId: string;
  paymentMethodId: string;
  connectedAccountId: string;
  description: string;
  metadata: Record<string, string>;
}) {
  return stripe.paymentIntents.create(
    {
      amount,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description,
      metadata,
    },
    {
      stripeAccount: connectedAccountId,
    }
  );
}

export async function createStripeCustomer({
  moveCustomerId,
  companyId,
  connectedAccountId,
}: {
  moveCustomerId: Id<"users">;
  companyId: Id<"companies">;
  connectedAccountId?: string;
}) {
  const customer = await stripe.customers.create(
    {
      metadata: {
        moveCustomerId,
        companyId,
      },
    },
    connectedAccountId ? { stripeAccount: connectedAccountId } : undefined
  );

  return customer;
}

export async function createStripeSetupIntent({
  stripeCustomerId,
  stripeConnectedAccountId,
}: {
  stripeCustomerId: string;
  stripeConnectedAccountId: string;
}): Promise<Stripe.SetupIntent> {
  return stripe.setupIntents.create(
    {
      customer: stripeCustomerId,
      usage: "off_session",
    },
    {
      stripeAccount: stripeConnectedAccountId,
    }
  );
}

export function constructConnectedStripeEvent(
  payload: string,
  signature: string,
  secret: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEventAsync(payload, signature, secret);
}

export async function retrieveConnectedPaymentMethod(
  paymentMethodId: string,
  connectedAccountId: string
) {
  return stripe.paymentMethods.retrieve(paymentMethodId, {
    stripeAccount: connectedAccountId,
  });
}

export async function retrieveConnectedStripeCustomer(
  stripeCustomerId: string,
  connectedAccountId: string
): Promise<Stripe.Customer> {
  const customer = await stripe.customers.retrieve(stripeCustomerId, {
    stripeAccount: connectedAccountId,
  });

  if ((customer as Stripe.DeletedCustomer).deleted) {
    throw new Error("Stripe customer was deleted");
  }

  return customer as Stripe.Customer;
}
