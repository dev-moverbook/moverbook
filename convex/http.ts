import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { WebhookHandlerResponse } from "@/types/convex-responses";
import {
  handleOrganizationInvitationAccepted,
  handleUserCreated,
} from "./webhooks/clerk";
import {
  handleInboundTwilioSms,
  processTollfreeVerificationEvent,
} from "./webhooks/twilio";
import { isTollfreeVerificationEvent } from "./backendUtils/twilioHelpers";
import { TwilioWebhookEventBase } from "@/types/types";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;
    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });
      switch (result.type) {
        case "user.created":
          await handleUserCreated(ctx, result.data);
          break;
        case "organizationInvitation.accepted":
          await handleOrganizationInvitationAccepted(ctx, result.data);

          break;
      }

      return new Response("Webhook processed", { status: 200 });
    } catch (error) {
      console.error("Error handling Clerk webhook:", error);
      return new Response("Webhook verification failed", { status: 400 });
    }
  }),
});

http.route({
  path: "/stripeConnectedAccount",
  method: "POST",
  handler: httpAction(async (ctx, request): Promise<Response> => {
    const signature: string = request.headers.get("stripe-signature") as string;
    const result = (await ctx.runAction(internal.connectedAccounts.fulfill, {
      signature,
      payload: await request.text(),
    })) as WebhookHandlerResponse;

    if (result.success) {
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response(result.error || "Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/twilio-events",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      if (!Array.isArray(body)) {
        throw new Error("Invalid Twilio webhook payload");
      }

      const events: TwilioWebhookEventBase[] = body;

      for (const event of events) {
        if (isTollfreeVerificationEvent(event)) {
          await processTollfreeVerificationEvent(ctx, {
            type: event.type,
            data: {
              phoneNumberSid: event.data.phone_number,
              verificationstatus: event.data.status,
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to process Twilio webhook:", error);
    }

    return new Response(null, { status: 200 });
  }),
});

http.route({
  path: "/twilio/inbound-sms",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    return handleInboundTwilioSms(ctx, request);
  }),
});

http.route({
  path: "/stripe-connected-payments",
  method: "POST",
  handler: httpAction(async (ctx, request): Promise<Response> => {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing Stripe signature", { status: 400 });
    }

    const payload = await request.text();

    const result = (await ctx.runAction(
      internal.webhooks.stripeConnected.fulfill,
      {
        signature,
        payload,
      }
    )) as WebhookHandlerResponse;

    if (result.success) {
      return new Response(null, { status: 200 });
    }

    return new Response(result.error || "Stripe webhook error", {
      status: 400,
    });
  }),
});

export default http;
