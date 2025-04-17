import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { internalMutation, mutation, internalQuery } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { shouldExposeError } from "./backendUtils/helper";
import {
  validateCompany,
  isUserInOrg,
  validateCompanyContact,
} from "./backendUtils/validate";
import { UpdateCompanyContactResponse } from "@/types/convex-responses";
import { CompanyContactSchema } from "@/types/convex-schemas";

export const updateCompanyContact = mutation({
  args: {
    companyContactId: v.id("companyContact"),
    updates: v.object({
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      address: v.optional(v.string()),
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
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(ErrorMessages.INTERNAL_ERROR, errorMessage, error);

      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: shouldExposeError(errorMessage)
          ? errorMessage
          : ErrorMessages.GENERIC_ERROR,
      };
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
  handler: async (ctx, { companyContactId }): Promise<CompanyContactSchema> => {
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
