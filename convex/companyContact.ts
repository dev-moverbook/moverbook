import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { shouldExposeError } from "./backendUtils/helper";
import {
  validateCompany,
  isUserInOrg,
  validateCompanyContact,
} from "./backendUtils/validate";
import { UpdateCompanyContactResponse } from "@/types/convex-responses";

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

      await ctx.db.patch(companyContact._id, updates);

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
