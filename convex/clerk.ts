import { ConvexError, v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { ClerkRoles } from "@/types/enums";
import { internal } from "./_generated/api";
import { ErrorMessages } from "@/types/errors";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  clerkInviteUserToOrganizationHelper,
  createClerkOrganization,
} from "./backendUtils/clerk";
import { CreatableUserRoleConvex } from "@/types/convex-enums";
import { isUserInOrg, validateDocExists } from "./backendUtils/validate";
import { Id } from "./_generated/dataModel";

export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error(
        "CLERK_WEBHOOK_SECRET is not set in environment variables"
      );
    }

    const wh = new Webhook(secret);
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
    return payload;
  },
});

export const createOrganization = action({
  args: {
    name: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ slug: string; clerkOrganizationId: string }> => {
    const { name } = args;

    const identity = await requireAuthenticatedUser(ctx);
    const clerkUserId = identity.id as string;
    const clerkOrg = await createClerkOrganization(name, clerkUserId);

    const slug = await ctx.runMutation(internal.companies.createCompany, {
      clerkOrganizationId: clerkOrg.id,
      name,
      clerkUserId,
    });

    return {
      slug,
      clerkOrganizationId: clerkOrg.id,
    };
  },
});

export const clerkInviteUserToOrganization = action({
  args: {
    companyId: v.id("companies"),
    email: v.string(),
    role: CreatableUserRoleConvex,
    hourlyRate: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, email, role, hourlyRate } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const existingUser = await ctx.runQuery(
      internal.users.getUserByEmailInternal,
      {
        email,
      }
    );

    if (existingUser) {
      throw new ConvexError({
        code: "CONFLICT",
        message: ErrorMessages.USER_WITH_EMAIL_EXISTS,
      });
    }

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      { companyId }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const response = await clerkInviteUserToOrganizationHelper(
      validatedCompany.clerkOrganizationId,
      email,
      role as string
    );

    const invitationId = await ctx.runMutation(
      internal.invitations.createInvitationInternal,
      {
        clerkInvitationId: response.id,
        clerkOrganizationId: validatedCompany.clerkOrganizationId,
        role,
        email,
        hourlyRate,
      }
    );

    return true;
  },
});
