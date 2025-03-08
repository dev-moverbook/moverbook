import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  isUserInOrg,
  validateCompany,
  validateReferral,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  CreateReferralResponse,
  GetActiveReferralsByCompanyIdResponse,
  UpdateReferralResponse,
} from "@/types/convex-responses";

export const getActiveReferralsByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (
    ctx,
    args
  ): Promise<GetActiveReferralsByCompanyIdResponse> => {
    const { companyId } = args;
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = await ctx.db.get(companyId);

      const validatedCompany = validateCompany(company);
      isUserInOrg(identity, validatedCompany.clerkOrganizationId);

      const referrals = await ctx.db
        .query("referrals")
        .filter((q) =>
          q.and(
            q.eq(q.field("companyId"), validatedCompany._id),
            q.eq(q.field("isActive"), true)
          )
        )
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: { referrals },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});

export const createReferral = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<CreateReferralResponse> => {
    const { companyId, name } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = await ctx.db.get(companyId);

      const validatedCompany = validateCompany(company);
      isUserInOrg(identity, validatedCompany.clerkOrganizationId);

      const referralId = await ctx.db.insert("referrals", {
        companyId,
        name,
        isActive: true,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { referralId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});

export const updateReferral = mutation({
  args: {
    referralId: v.id("referrals"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateReferralResponse> => {
    const { referralId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const referral = await ctx.db.get(referralId);
      const validatedReferral = validateReferral(referral);

      const company = await ctx.db.get(validatedReferral.companyId);
      const validatedCompany = validateCompany(company);
      isUserInOrg(identity, validatedCompany.clerkOrganizationId);

      await ctx.db.patch(referralId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { referralId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});
