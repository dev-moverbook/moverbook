import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { WebhookHandlerResponse } from "@/types/convex-responses";
import {
  handleOrganizationInvitationAccepted,
  handleUserCreated,
} from "./webhooks/clerk";

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

export default http;
