import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateMove,
  isUserInOrg,
  validateAdditionalFee,
} from "./backendUtils/validate";
import { handleInternalError } from "./backendUtils/helper";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  CreateAdditionalFeeResponse,
  UpdateAdditionalFeeResponse,
} from "@/types/convex-responses";

export const createAdditionalFee = mutation({
  args: {
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    feeId: v.optional(v.id("fees")),
  },
  handler: async (ctx, args): Promise<CreateAdditionalFeeResponse> => {
    const { moveId, name, price, quantity, feeId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const move = validateMove(await ctx.db.get(moveId));
      const company = validateCompany(await ctx.db.get(move.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const additionalFeeId = await ctx.db.insert("additionalFees", {
        moveId,
        name,
        price,
        quantity,
        feeId,
        isActive: true,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { additionalFeeId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const updateAdditionalFee = mutation({
  args: {
    additionalFeeId: v.id("additionalFees"),
    updates: v.object({
      name: v.optional(v.string()),
      price: v.optional(v.number()),
      quantity: v.optional(v.number()),
      feeId: v.optional(v.id("fees")),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateAdditionalFeeResponse> => {
    const { additionalFeeId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const fee = validateAdditionalFee(await ctx.db.get(additionalFeeId));
      const move = validateMove(await ctx.db.get(fee.moveId));
      const company = validateCompany(await ctx.db.get(move.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(additionalFeeId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { additionalFeeId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
