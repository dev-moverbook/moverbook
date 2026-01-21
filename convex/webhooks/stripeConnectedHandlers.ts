import Stripe from "stripe";
import { internal } from "../_generated/api";
import { ActionCtx } from "../_generated/server";
import {
  retrieveConnectedPaymentMethod,
  retrieveConnectedStripeCustomer,
} from "../functions/stripe";
import { Id } from "../_generated/dataModel";
import { formatCurrency } from "@/frontendUtils/helper";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";

export async function handleSetupIntentSucceeded(
  ctx: ActionCtx,
  event: Stripe.Event,
  connectedAccountId?: string
) {
  const setupIntent = event.data.object as Stripe.SetupIntent;

  if (!setupIntent.customer || !connectedAccountId) {
    return;
  }
  const stripeCustomerId = setupIntent.customer as string;

  const paymentMethodId =
    typeof setupIntent.payment_method === "string"
      ? setupIntent.payment_method
      : setupIntent.payment_method?.id;

  if (!paymentMethodId) {
    return;
  }

  const paymentMethod = await retrieveConnectedPaymentMethod(
    paymentMethodId,
    connectedAccountId
  );

  if (paymentMethod.type !== "card" || !paymentMethod.card) {
    return;
  }

  const { brand, last4, exp_month, exp_year } = paymentMethod.card;

  const connectedAccount = await ctx.runQuery(
    internal.connectedAccounts.getConnectedAccountByStripeAccountIdInternal,
    {
      stripeAccountId: connectedAccountId,
    }
  );

  if (!connectedAccount) {
    return;
  }

  const stripeCustomer = await retrieveConnectedStripeCustomer(
    stripeCustomerId,
    connectedAccountId
  );

  const { moveCustomerId, companyId } = stripeCustomer.metadata;

  await ctx.runMutation(
    internal.moveCustomerStripeProfiles.updatePaymentMethodFromSetupIntent,
    {
      moveCustomerId: moveCustomerId as Id<"users">,
      companyId: companyId as Id<"companies">,
      paymentMethodId: paymentMethod.id,
      cardBrand: brand,
      cardLast4: last4,
      cardExpMonth: exp_month as number,
      cardExpYear: exp_year as number,
    }
  );
}
export async function handlePaymentIntentSucceeded(
  ctx: ActionCtx,
  event: Stripe.Event
) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  const payment = await ctx.runQuery(
    internal.payments.getPaymentByPaymentIntentId,
    {
      stripePaymentIntentId: paymentIntent.id,
    }
  );

  if (!payment) {
    console.warn("[Stripe webhook] Payment record not found", {
      stripePaymentIntentId: paymentIntent,
    });
    return;
  }

  const user = await ctx.runQuery(internal.users.getUserByIdInternal, {
    userId: payment.userId,
  });

  if (!user) {
    console.warn("[Stripe webhook] User record not found", {
      userId: payment.userId,
    });
    return;
  }

  const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
    moveId: payment.moveId,
  });

  if (!move) {
    console.warn("[Stripe webhook] Move record not found", {
      moveId: payment.moveId,
    });
  }

  await ctx.runMutation(internal.payments.updatePaymentByPaymentIntentId, {
    id: payment._id,
    updates: {
      status: "succeeded",
    },
  });

  await ctx.runMutation(internal.moves.updateMoveInternal, {
    moveId: payment.moveId,
    updates: {
      depositPaid: true,
      moveStatus: "Booked",
      depositPaymentId: payment._id,
      depositPaidAt: Date.now(),
      depositPaymentError: null,
    },
  });

  const moveDate = move?.moveDate
    ? formatMonthDayLabelStrict(move.moveDate)
    : "TBD";
  const depositAmount = formatCurrency(payment.amount);

  await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
    entry: {
      type: "QUOTE_SIGNED",
      companyId: payment.companyId,
      body: `**${user.name}** signed proposal for **${moveDate}** deposit paid ${depositAmount}`,
      moveId: payment.moveId,
      moveCustomerId: payment.userId,
    },
  });
}

export async function handlePaymentIntentFailed(
  ctx: ActionCtx,
  event: Stripe.Event
) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  const payment = await ctx.runQuery(
    internal.payments.getPaymentByPaymentIntentId,
    {
      stripePaymentIntentId: paymentIntent.id,
    }
  );

  if (!payment) {
    console.warn("[Stripe webhook] Payment record not found for failure", {
      stripePaymentIntentId: paymentIntent.id,
    });
    return;
  }

  const errorMessage =
    paymentIntent.last_payment_error?.message ||
    paymentIntent.last_payment_error?.code ||
    "Payment failed";

  await ctx.runMutation(internal.payments.updatePaymentByPaymentIntentId, {
    id: payment._id,
    updates: {
      status: "failed",
      failureReason: errorMessage,
    },
  });

  await ctx.runMutation(internal.moves.updateMoveInternal, {
    moveId: payment.moveId,
    updates: {
      depositPaid: false,
      depositPaymentError: errorMessage,
    },
  });
}
