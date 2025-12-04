import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateDocument } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";

export const updatePolicy = mutation({
  args: {
    policyId: v.id("policies"),
    updates: v.object({
      weekdayHourMinimum: v.optional(v.number()),
      weekendHourMinimum: v.optional(v.number()),
      deposit: v.optional(v.number()),
      cancellationFee: v.optional(v.number()),
      cancellationCutoffHour: v.optional(v.number()),
      additionalTermsAndConditions: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { policyId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const policy = await validateDocument(
      ctx.db,
      "policies",
      policyId,
      ErrorMessages.POLICY_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, policy.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(policyId, updates);

    return true;
  },
});
