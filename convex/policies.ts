import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validatePolicy } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { Doc } from "./_generated/dataModel";

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

    const policy = validatePolicy(await ctx.db.get(policyId));
    const company = validateCompany(await ctx.db.get(policy.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(policyId, updates);

    return true;
  },
});

// not used
export const getPolicy = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"policies">> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const policy = validatePolicy(
      await ctx.db
        .query("policies")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .first()
    );

    return policy;
  },
});
