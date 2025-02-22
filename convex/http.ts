import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { UserRole } from "@/types/enums";

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
          await ctx.runMutation(internal.users.createUser, {
            clerkUserId: result.data.id,
            email: result.data.email_addresses[0].email_address,
            name: `${result.data.first_name} ${result.data.last_name}`,
            role: UserRole.ADMIN,
          });
      }

      return new Response("Webhook processed", { status: 200 });
    } catch (error) {
      console.error("Error handling Clerk webhook:", error);
      return new Response("Webhook verification failed", { status: 400 });
    }
  }),
});

export default http;
