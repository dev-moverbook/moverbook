import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validatePolicy } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import { UpdatePolicyResponse } from "@/types/convex-responses";

export const updatePolicy = mutation({
  args: {
    policyId: v.id("policies"),
    updates: v.object({
      weekdayHourMinimum: v.optional(v.number()),
      weekendHourMinimum: v.optional(v.number()),
      deposit: v.optional(v.number()),
      cancellationFee: v.optional(v.number()),
      cancellationCutoffHour: v.optional(v.number()),
      billOfLandingDisclaimerAndTerms: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<UpdatePolicyResponse> => {
    const { policyId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const policy = validatePolicy(await ctx.db.get(policyId));
      const company = validateCompany(await ctx.db.get(policy.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(policyId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { policyId },
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
