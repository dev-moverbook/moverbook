import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";

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

    const move = await validateDocument(
      ctx.db,
      "move",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
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

    const fee = await validateDocument(
      ctx.db,
      "additionalFees",
      additionalFeeId,
      ErrorMessages.ADDITIONAL_FEE_NOT_FOUND
    );
    const move = await validateDocument(
      ctx.db,
      "move",
      fee.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(additionalFeeId, updates);

    return true;
  },
});
