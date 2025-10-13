import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateMove,
  isUserInOrg,
  validateDiscount,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";

export const createDiscount = mutation({
  args: {
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"discounts">> => {
    const { moveId, name, price } = args;

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

    const discountId = await ctx.db.insert("discounts", {
      moveId,
      name,
      price,
      isActive: true,
    });

    return discountId;
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
  handler: async (ctx, args): Promise<Id<"discounts">> => {
    const { discountId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const discount = validateDiscount(await ctx.db.get(discountId));
    const move = validateMove(await ctx.db.get(discount.moveId));
    const company = validateCompany(await ctx.db.get(move.companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(discountId, updates);

    return discountId;
  },
});
