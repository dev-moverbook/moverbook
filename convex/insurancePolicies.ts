import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateDocument } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";

export const createInsurancePolicy = mutation({
  args: {
    companyId: v.id("companies"),
    coverageType: v.number(),
    coverageAmount: v.number(),
    name: v.string(),
    premium: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, coverageType, coverageAmount, name, premium } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.insert("insurancePolicies", {
      companyId,
      coverageType,
      coverageAmount,
      isActive: true,
      isDefault: false,
      name,
      premium,
    });

    return true;
  },
});

export const updateInsurancePolicy = mutation({
  args: {
    insurancePolicyId: v.id("insurancePolicies"),
    updates: v.object({
      coverageType: v.optional(v.number()),
      coverageAmount: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
      name: v.optional(v.string()),
      premium: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { insurancePolicyId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const insurancePolicy = await validateDocument(
      ctx.db,
      "insurancePolicies",
      insurancePolicyId,
      ErrorMessages.INSURANCE_POLICY_NOT_FOUND
    );

    const company = await validateCompany(ctx.db, insurancePolicy.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(insurancePolicyId, updates);

    return true;
  },
});

export const getInsurancePolicies = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"insurancePolicies">[]> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const insurancePolicies = await ctx.db
      .query("insurancePolicies")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return insurancePolicies;
  },
});
