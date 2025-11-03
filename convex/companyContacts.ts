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
  validateDocument,
} from "./backendUtils/validate";
import { AddressConvex } from "./schema";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { getFirstByCompanyId } from "./backendUtils/queries";

export const updateCompanyContact = mutation({
  args: {
    companyContactId: v.id("companyContacts"),
    updates: v.object({
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      address: v.optional(AddressConvex),
      website: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyContactId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const companyContact = await validateDocument(
      ctx.db,
      "companyContacts",
      companyContactId,
      ErrorMessages.COMPANY_CONTACT_NOT_FOUND
    );

    const company = await validateCompany(ctx.db, companyContact.companyId);

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

    return true;
  },
});

export const updateSendgridInfo = internalMutation({
  args: {
    companyContactId: v.id("companyContacts"),
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
    companyContactId: v.id("companyContacts"),
  },
  handler: async (
    ctx,
    { companyContactId }
  ): Promise<Doc<"companyContacts">> => {
    const companyContact = validateCompanyContact(
      await ctx.db.get(companyContactId)
    );

    return companyContact;
  },
});

export const getCompanyContactByCompanyIdInternal = internalQuery({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (
    ctx,
    { companyId }
  ): Promise<Doc<"companyContacts"> | null> => {
    const companyContact = await ctx.db
      .query("companyContacts")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .first();

    return companyContact;
  },
});

export const getCompanyContact = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"companyContacts">> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const companyContact = await getFirstByCompanyId(
      ctx.db,
      "companyContacts",
      companyId,
      ErrorMessages.COMPANY_CONTACT_NOT_FOUND
    );

    return companyContact;
  },
});
