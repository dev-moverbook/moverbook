import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateInsurancePolicy,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";

export const createInsurancePolicy = mutation({
  args: {
    companyId: v.id("companies"),
    coverageType: v.number(),
    coverageAmount: v.number(),
    name: v.string(),
    premium: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"insurancePolicies">> => {
    const { companyId, coverageType, coverageAmount, name, premium } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const insurancePolicyId = await ctx.db.insert("insurancePolicies", {
      companyId,
      coverageType,
      coverageAmount,
      isActive: true,
      isDefault: false,
      name,
      premium,
    });

    return insurancePolicyId;
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
  handler: async (ctx, args): Promise<Id<"insurancePolicies">> => {
    const { insurancePolicyId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const insurancePolicy = validateInsurancePolicy(
      await ctx.db.get(insurancePolicyId)
    );
    const company = validateCompany(
      await ctx.db.get(insurancePolicy.companyId)
    );

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(insurancePolicyId, updates);

    return insurancePolicyId;
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

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const insurancePolicies = await ctx.db
      .query("insurancePolicies")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return insurancePolicies;
  },
});
