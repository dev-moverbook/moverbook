import { ResponseStatus, ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateCompliance,
} from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import { UpdateComplianceResponse } from "@/types/convex-responses";

export const updateCompliance = mutation({
  args: {
    complianceId: v.id("compliance"),
    updates: v.object({
      statePucPermitNumber: v.optional(v.string()),
      dmvNumber: v.optional(v.string()),
      usDotNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateComplianceResponse> => {
    const { complianceId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const compliance = validateCompliance(await ctx.db.get(complianceId));

      const company = validateCompany(await ctx.db.get(compliance.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(compliance._id, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { complianceId: compliance._id },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error("Internal Error:", errorMessage, error);

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
