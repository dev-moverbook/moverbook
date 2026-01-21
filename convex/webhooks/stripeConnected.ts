import Stripe from "stripe";
import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { WebhookHandlerResponse } from "@/types/convex-responses";
import { constructConnectedStripeEvent } from "../functions/stripe";
import { throwConvexError } from "../backendUtils/errors";
import {
  handleSetupIntentSucceeded,
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
} from "./stripeConnectedHandlers";
import { serverEnv } from "../backendUtils/serverEnv";

export const fulfill = internalAction({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (
    ctx,
    { signature, payload }
  ): Promise<WebhookHandlerResponse> => {
    let event: Stripe.Event;

    try {
      const { STRIPE_CONNECTED_PAYMENTS_WEBHOOK_SECRET } = serverEnv();
      event = await constructConnectedStripeEvent(
        payload,
        signature,
        STRIPE_CONNECTED_PAYMENTS_WEBHOOK_SECRET
      );
    } catch (err) {
      throwConvexError(err, {
        code: "INTERNAL_ERROR",
        showToUser: false,
      });
    }

    const connectedAccountId = event.account as string | undefined;

    try {
      switch (event.type) {
        case "setup_intent.succeeded":
          await handleSetupIntentSucceeded(ctx, event, connectedAccountId);
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(ctx, event);
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(ctx, event);
          break;

        default:
          break;
      }

      return { success: true };
    } catch (error) {
      throwConvexError(error, {
        code: "INTERNAL_ERROR",
        showToUser: false,
      });
    }
  },
});
