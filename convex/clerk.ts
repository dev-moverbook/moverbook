import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { ClerkRoles, ResponseStatus, UserRole } from "@/types/enums";
import { internal } from "./_generated/api";
import {
  ClerkInviteUserToOrganizationResponse,
  CreateOrganizationResponse,
} from "@/types/convex-responses";
import { ErrorMessages } from "@/types/errors";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  clerkInviteUserToOrganizationHelper,
  createClerkOrganization,
} from "./backendUtils/clerk";
import { CreatableUserRoleConvex, UserRoleConvex } from "@/types/convex-enums";
import { isUserInOrg, validateCompany } from "./backendUtils/validate";

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

      const slug = await ctx.runMutation(internal.companies.createCompany, {
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
        error:
          error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});

export const clerkInviteUserToOrganization = action({
  args: {
    slug: v.string(),
    email: v.string(),
    role: CreatableUserRoleConvex,
    hourlyRate: v.union(v.number(), v.null()),
  },
  handler: async (
    ctx,
    args
  ): Promise<ClerkInviteUserToOrganizationResponse> => {
    const { slug, email, role, hourlyRate } = args;

    try {
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
        throw new Error(ErrorMessages.USER_WITH_EMAIL_EXISTS);
      }

      const company = await ctx.runQuery(
        internal.companies.getCompanyBySlugInternal,
        { slug }
      );
      const validatedCompany = validateCompany(company);
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { invitationId },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error:
          error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});
