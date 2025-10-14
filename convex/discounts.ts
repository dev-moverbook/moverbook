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

export const createDiscount = mutation({
  args: {
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, name, price } = args;

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

    await ctx.db.insert("discounts", {
      moveId,
      name,
      price,
      isActive: true,
    });

    return true;
  },
});

export const updateDiscount = mutation({
  args: {
    discountId: v.id("discounts"),
    updates: v.object({
      name: v.optional(v.string()),
      price: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { discountId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const discount = await validateDocument(
      ctx.db,
      "discounts",
      discountId,
      ErrorMessages.DISCOUNT_NOT_FOUND
    );
    const move = await validateDocument(
      ctx.db,
      "move",
      discount.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(discountId, updates);

    return true;
  },
});
