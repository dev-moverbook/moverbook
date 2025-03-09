import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateInsurancePolicy,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import {
  CreateInsurancePolicyResponse,
  UpdateInsurancePolicyResponse,
} from "@/types/convex-responses";

export const createInsurancePolicy = mutation({
  args: {
    companyId: v.id("companies"),
    coverageType: v.number(),
    coverageAmount: v.number(),
    isDefault: v.boolean(),
    name: v.string(),
    premium: v.number(),
  },
  handler: async (ctx, args): Promise<CreateInsurancePolicyResponse> => {
    const {
      companyId,
      coverageType,
      coverageAmount,
      isDefault,
      name,
      premium,
    } = args;

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
        isDefault,
        name,
        premium,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { insurancePolicyId },
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

export const updateInsurancePolicy = mutation({
  args: {
    insurancePolicyId: v.id("insurancePolicies"),
    updates: v.object({
      coverageType: v.optional(v.number()),
      coverageAmount: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
      isDefault: v.optional(v.boolean()),
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
