import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { InvitationStatusConvex, UserRoleConvex } from "@/types/convex-enums";
import { Doc, Id } from "./_generated/dataModel";
import { ClerkRoles, InvitationStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateInvitation,
} from "./backendUtils/validate";
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

    return await ctx.db.insert("invitations", {
      clerkInvitationId,
      status: InvitationStatus.PENDING,
      clerkOrganizationId,
      role,
      email,
      hourlyRate,
    });
  },
});

export const getAcceptedInvitationByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"invitations"> | null> => {
    const invitation: Doc<"invitations"> | null = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) =>
        q.eq("status", InvitationStatus.ACCEPTED as unknown as string)
      )
      .first();

    return invitation;
  },
});

export const updateInvitationByClerkId = internalMutation({
  args: {
    clerkInvitationId: v.string(),
    status: InvitationStatusConvex,
  },
  handler: async (ctx, args): Promise<Doc<"invitations">> => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_clerkInvitationId", (q) =>
        q.eq("clerkInvitationId", args.clerkInvitationId)
      )
      .first();

    if (!invitation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: ErrorMessages.INVITATION_NOT_FOUND,
      });
    }

    await ctx.db.patch(invitation._id, { status: args.status });

    return invitation;
  },
});

export const getActiveInvitationsByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"invitations">[]> => {
    const { companyId } = args;

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

    return invitations;
  },
});

export const revokeInviteUser = action({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { invitationId } = args;

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
    return true;
  },
});

export const getInvitationById = internalQuery({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args): Promise<Doc<"invitations"> | null> => {
    const { invitationId } = args;

    return await ctx.db.get(invitationId);
  },
});
