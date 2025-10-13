import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  internalQuery,
  query,
} from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateCompanyContact,
} from "./backendUtils/validate";
import { AddressConvex } from "./schema";
import { Doc, Id } from "./_generated/dataModel";

export const updateCompanyContact = mutation({
  args: {
    companyContactId: v.id("companyContact"),
    updates: v.object({
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      address: v.optional(AddressConvex),
      website: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"companyContact">> => {
    const { companyContactId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const companyContact = validateCompanyContact(
      await ctx.db.get(companyContactId)
    );

    const company = validateCompany(await ctx.db.get(companyContact.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    const emailChanged =
      updates.email && updates.email !== companyContact.email;
    const addressChanged =
      updates.address && updates.address !== companyContact.address;

    const finalUpdates: Record<string, unknown> = {
      ...updates,
    };

    if (emailChanged || addressChanged) {
      finalUpdates.sendgridSenderId = undefined;
      finalUpdates.sendgridVerified = undefined;
      finalUpdates.sendgridName = undefined;
    }

    await ctx.db.patch(companyContact._id, finalUpdates);

    return companyContact._id;
  },
});

export const updateSendgridInfo = internalMutation({
  args: {
    companyContactId: v.id("companyContact"),
    updates: v.object({
      sendgridSenderId: v.optional(v.string()),
      sendgridVerified: v.optional(v.boolean()),
      sendgridName: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { companyContactId, updates }) => {
    await ctx.db.patch(companyContactId, updates);
  },
});

export const getCompanyContactInternal = internalQuery({
  args: {
    companyContactId: v.id("companyContact"),
  },
  handler: async (
    ctx,
    { companyContactId }
  ): Promise<Doc<"companyContact">> => {
    const companyContact = validateCompanyContact(
      await ctx.db.get(companyContactId)
    );

    return companyContact;
  },
});

export const getCompanyContact = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"companyContact">> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const companyContact = validateCompanyContact(
      await ctx.db
        .query("companyContact")
        .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
        .first()
    );

    return companyContact;
  },
});
