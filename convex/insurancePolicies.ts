import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateInsurancePolicy,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import {
  CreateInsurancePolicyResponse,
  GetInsurancePoliciesResponse,
  UpdateInsurancePolicyResponse,
} from "@/types/convex-responses";
import { handleInternalError } from "./backendUtils/helper";
export const createInsurancePolicy = mutation({
  args: {
    companyId: v.id("companies"),
    coverageType: v.number(),
    coverageAmount: v.number(),
    name: v.string(),
    premium: v.number(),
  },
  handler: async (ctx, args): Promise<CreateInsurancePolicyResponse> => {
    const { companyId, coverageType, coverageAmount, name, premium } = args;

    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { insurancePolicyId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
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
  handler: async (ctx, args): Promise<UpdateInsurancePolicyResponse> => {
    const { insurancePolicyId, updates } = args;

    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { insurancePolicyId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getInsurancePolicies = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<GetInsurancePoliciesResponse> => {
    const { companyId } = args;

    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { insurancePolicies },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
