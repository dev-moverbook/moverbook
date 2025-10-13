import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateMove,
  isUserInOrg,
  validateAdditionalFee,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Id } from "./_generated/dataModel";

export const createAdditionalFee = mutation({
  args: {
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    feeId: v.optional(v.id("fees")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, name, price, quantity, feeId } = args;

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

    await ctx.db.insert("additionalFees", {
      moveId,
      name,
      price,
      quantity,
      feeId,
      isActive: true,
    });

    return true;
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
  handler: async (ctx, args): Promise<boolean> => {
    const { additionalFeeId, updates } = args;

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

    return true;
  },
});
