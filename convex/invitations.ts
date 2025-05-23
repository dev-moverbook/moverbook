import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { InvitationStatusConvex, UserRoleConvex } from "@/types/convex-enums";
import { Id } from "./_generated/dataModel";
import { ClerkRoles, InvitationStatus, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { InvitationSchema } from "@/types/convex-schemas";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateInvitation,
} from "./backendUtils/validate";
import {
  GetActiveInvitationsByCompanyIdResponse,
  RevokeInviteUserResponse,
} from "@/types/convex-responses";
import { internal } from "./_generated/api";
import { revokeOrganizationInvitation } from "./backendUtils/clerk";

export const createInvitationInternal = internalMutation({
  args: {
    clerkInvitationId: v.string(),
    clerkOrganizationId: v.string(),
    role: UserRoleConvex,
    email: v.string(),
    hourlyRate: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args): Promise<Id<"invitations">> => {
    const { clerkInvitationId, clerkOrganizationId, role, email, hourlyRate } =
      args;

    try {
      return await ctx.db.insert("invitations", {
        clerkInvitationId,
        status: InvitationStatus.PENDING,
        clerkOrganizationId,
        role,
        email,
        hourlyRate,
      });
    } catch (error) {
      console.error(ErrorMessages.INVITATION_DB_CREATE, error);
      throw new Error(ErrorMessages.INVITATION_DB_CREATE);
    }
  },
});

export const getAcceptedInvitationByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<InvitationSchema | null> => {
    try {
      const invitation: InvitationSchema | null = await ctx.db
        .query("invitations")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .filter((q) =>
          q.eq("status", InvitationStatus.ACCEPTED as unknown as string)
        )
        .first();

      return invitation;
    } catch (error) {
      console.error(ErrorMessages.INVITATION_DB_QUERY_BY_EMAIL, error);
      throw new Error(ErrorMessages.INVITATION_DB_QUERY_BY_EMAIL);
    }
  },
});

export const updateInvitationByClerkId = internalMutation({
  args: {
    clerkInvitationId: v.string(),
    status: InvitationStatusConvex,
  },
  handler: async (ctx, args): Promise<InvitationSchema> => {
    try {
      const invitation = await ctx.db
        .query("invitations")
        .withIndex("by_clerkInvitationId", (q) =>
          q.eq("clerkInvitationId", args.clerkInvitationId)
        )
        .first();

      if (!invitation) {
        throw new Error(ErrorMessages.INVITATION_NOT_FOUND);
      }

      await ctx.db.patch(invitation._id, { status: args.status });

      return invitation;
    } catch (error) {
      console.error(error);
      throw new Error(ErrorMessages.INVITATION_DB_UPDATE);
    }
  },
});

export const getActiveInvitationsByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (
    ctx,
    args
  ): Promise<GetActiveInvitationsByCompanyIdResponse> => {
    const { companyId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);
      const company = await ctx.db.get(companyId);

      const validatedCompany = validateCompany(company);

      isUserInOrg(identity, validatedCompany.clerkOrganizationId);

      const invitations = await ctx.db
        .query("invitations")
        .withIndex("by_clerkOrganizationId", (q) =>
          q.eq("clerkOrganizationId", validatedCompany.clerkOrganizationId)
        )
        .filter((q) => q.eq(q.field("status"), InvitationStatus.PENDING))
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: { invitations },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});

export const revokeInviteUser = action({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args): Promise<RevokeInviteUserResponse> => {
    const { invitationId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const invitation = await ctx.runQuery(
        internal.invitations.getInvitationById,
        { invitationId }
      );
      const validatedInvitation = validateInvitation(invitation);

      isUserInOrg(identity, validatedInvitation.clerkOrganizationId);
      await revokeOrganizationInvitation(
        validatedInvitation.clerkOrganizationId,
        validatedInvitation.clerkInvitationId
      );
      await Promise.all([
        revokeOrganizationInvitation(
          validatedInvitation.clerkOrganizationId,
          validatedInvitation.clerkInvitationId
        ),
        ctx.runMutation(internal.invitations.updateInvitationByClerkId, {
          clerkInvitationId: validatedInvitation.clerkInvitationId,
          status: InvitationStatus.REVOKED,
        }),
      ]);
      return {
        status: ResponseStatus.SUCCESS,
        data: { invitationId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});

export const getInvitationById = internalQuery({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args): Promise<InvitationSchema | null> => {
    const { invitationId } = args;

    try {
      return await ctx.db.get(invitationId);
    } catch (error) {
      console.error(ErrorMessages.INVITATION_DB_QUERY_BY_ID, error);
      throw new Error(ErrorMessages.INVITATION_DB_QUERY_BY_ID);
    }
  },
});
