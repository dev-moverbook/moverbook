import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  ClerkRoles,
  InvitationStatus,
  UserRole,
  StripeAccountStatus,
} from "@/types/enums";
import { validateCompany } from "./backendUtils/validate";
import { stripe } from "./backendUtils/stripe";
import Stripe from "stripe";
import { WebhookHandlerResponse } from "@/types/convex-responses";

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
          // const invitation = await ctx.runQuery(
          //   internal.invitations.getAcceptedInvitationByEmail,
          //   {
          //     email: result.data.email_addresses[0].email_address,
          //   }
          // );

          // if (invitation) {
          //   const company = await ctx.runQuery(
          //     internal.companies.getCompanyClerkOrgIdInternal,
          //     { clerkOrgId: invitation.clerkOrganizationId }
          //   );
          //   const validatedCompany = validateCompany(company);
          //   await ctx.runMutation(internal.users.createUser, {
          //     clerkUserId: result.data.id,
          //     email: result.data.email_addresses[0].email_address,
          //     name: `${result.data.first_name} ${result.data.last_name}`,
          //     role: invitation.role,
          //     hourlyRate: invitation.hourlyRate,
          //     imageUrl: result.data.image_url,
          //     companyId: validatedCompany._id,
          //   });
          //   break;
          // }

          const customer = await ctx.runQuery(
            internal.customers.viewCustomerByEmail,
            {
              email: result.data.email_addresses[0].email_address,
            }
          );
          if (!customer) {
            await ctx.runMutation(internal.users.createUser, {
              clerkUserId: result.data.id,
              email: result.data.email_addresses[0].email_address,
              name: `${result.data.first_name} ${result.data.last_name}`,
              imageUrl: result.data.image_url,
            });
          } else {
            await ctx.runMutation(internal.users.createUser, {
              clerkUserId: result.data.id,
              email: result.data.email_addresses[0].email_address,
              name: `${result.data.first_name} ${result.data.last_name}`,
              role: ClerkRoles.ADMIN,
              customerId: customer._id,
              imageUrl: result.data.image_url,
            });
          }
          break;
        case "organizationInvitation.accepted":
          const invitation = await ctx.runMutation(
            internal.invitations.updateInvitationByClerkId,
            {
              clerkInvitationId: result.data.id,
              status: InvitationStatus.ACCEPTED,
            }
          );
          await ctx.runMutation(internal.users.updateUserByEmailInternal, {
            email: result.data.email_address,
            role: result.data.role as ClerkRoles,
            clerkOrganizationId: result.data.organization_id,
            hourlyRate: invitation.hourlyRate || null,
          });

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
    const result = (await ctx.runAction(internal.connectedAccount.fulfill, {
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
