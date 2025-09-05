import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  internalQuery,
  query,
} from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { handleInternalError } from "./backendUtils/helper";
import {
  validateCompany,
  isUserInOrg,
  validateCompanyContact,
} from "./backendUtils/validate";
import {
  GetCompanyContactResponse,
  UpdateCompanyContactResponse,
} from "@/types/convex-responses";
import { AddressConvex } from "./schema";
import { Doc } from "./_generated/dataModel";

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
  handler: async (ctx, args): Promise<UpdateCompanyContactResponse> => {
    const { companyContactId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const companyContact = validateCompanyContact(
        await ctx.db.get(companyContactId)
      );

      const company = validateCompany(
        await ctx.db.get(companyContact.companyId)
      );

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

      return {
        status: ResponseStatus.SUCCESS,
        data: { companyContactId: companyContact._id },
      };
    } catch (error) {
      return handleInternalError(error);
    }
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
    try {
      await ctx.db.patch(companyContactId, updates);
    } catch (error) {
      console.error(ErrorMessages.COMPANY_CONTACT_UPDATE, error);
      throw new Error(ErrorMessages.COMPANY_CONTACT_UPDATE);
    }
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
    try {
      const companyContact = validateCompanyContact(
        await ctx.db.get(companyContactId)
      );

      return companyContact;
    } catch (error) {
      console.error(ErrorMessages.COMPANY_CONTACT_QUERY, error);
      throw new Error(ErrorMessages.COMPANY_CONTACT_QUERY);
    }
  },
});

export const getCompanyContact = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<GetCompanyContactResponse> => {
    const { companyId } = args;

    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { companyContact },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
