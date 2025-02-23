import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { requireAuthenticatedUser } from "@/utils/auth";
import { ResponseStatus, UserRole } from "@/types/enums";
import { createClerkOrganization } from "@/utils/clerk";
import { internal } from "./_generated/api";
import { CreateOrganizationResponse } from "@/types/convex-responses";
import { ErrorMessages } from "@/types/errors";

export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});

export const createOrganization = action({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args): Promise<CreateOrganizationResponse> => {
    const { name } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx);
      const clerkUserId = identity.id as string;
      const clerkOrg = await createClerkOrganization(name, clerkUserId);

      const slug = await ctx.runMutation(internal.company.createCompany, {
        clerkOrganizationId: clerkOrg.id,
        name,
        clerkUserId,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          slug,
          clerkOrganizationId: clerkOrg.id,
        },
      };
    } catch (error) {
      console.error("Error creating organization:", error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: error instanceof Error ? error.message : ErrorMessages.GENERIC,
      };
    }
  },
});
