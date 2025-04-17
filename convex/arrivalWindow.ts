import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateArrivalWindow,
  validatePolicy,
} from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import {
  GetCompanyArrivalAndPoliciesResponse,
  UpdateArrivalWindowResponse,
} from "@/types/convex-responses";

export const getCompanyArrivalAndPolicies = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetCompanyArrivalAndPoliciesResponse> => {
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

      const arrivalWindow = validateArrivalWindow(
        await ctx.db
          .query("arrivalWindow")
          .filter((q) => q.eq(q.field("companyId"), companyId))
          .first()
      );

      const policy = validatePolicy(
        await ctx.db
          .query("policies")
          .filter((q) => q.eq(q.field("companyId"), companyId))
          .first()
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          arrivalWindow,
          policy,
        },
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

export const updateArrivalWindow = mutation({
  args: {
    arrivalWindowId: v.id("arrivalWindow"),
    updates: v.object({
      morningArrival: v.optional(v.string()),
      morningEnd: v.optional(v.string()),
      afternoonArrival: v.optional(v.string()),
      afternoonEnd: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateArrivalWindowResponse> => {
    const { arrivalWindowId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const arrivalWindow = validateArrivalWindow(
        await ctx.db.get(arrivalWindowId)
      );
      const company = validateCompany(
        await ctx.db.get(arrivalWindow.companyId)
      );

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(arrivalWindowId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { arrivalWindowId },
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
