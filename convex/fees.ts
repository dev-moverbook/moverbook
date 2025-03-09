import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateFee } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import { CreateFeeResponse, UpdateFeeResponse } from "@/types/convex-responses";

export const createFee = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<CreateFeeResponse> => {
    const { companyId, name, price } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const feeId = await ctx.db.insert("fees", {
        companyId,
        name,
        price,
        isActive: true,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { feeId },
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

export const updateFee = mutation({
  args: {
    feeId: v.id("fees"),
    updates: v.object({
      name: v.optional(v.string()),
      price: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateFeeResponse> => {
    const { feeId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const fee = validateFee(await ctx.db.get(feeId));
      const company = validateCompany(await ctx.db.get(fee.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(feeId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { feeId },
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
