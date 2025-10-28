import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
  validateUser,
  validateMoveCustomer,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";

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

    const user = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) =>
          q.eq("clerkUserId", identity.id as string)
        )
        .first()
    );

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";
    await ctx.db.insert("discounts", {
      moveId,
      name,
      price,
      isActive: true,
    });

    const amount = price * -1;

    await ctx.db.insert("newsFeed", {
      body: `**${user.name}** added discount **${name}** to **${moveCustomer.name}** **(${moveDate})**.`,
      companyId: company._id,
      type: "DISCOUNT_ADDED",
      userId: user._id,
      context: {
        customerName: moveCustomer.name,
        moveDate: moveDate,
        discountName: name,
      },
      amount,
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

    const user = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) =>
          q.eq("clerkUserId", identity.id as string)
        )
        .first()
    );

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    const amount =
      updates.price !== undefined ? updates.price * -1 : discount.price * -1;
    await ctx.db.patch(discountId, updates);

    if (updates.isActive === false) {
      await ctx.db.insert("newsFeed", {
        body: `**${user.name}** removed discount **${discount.name}** from **${moveCustomer.name}** **(${moveDate})**.`,
        companyId: company._id,
        type: "DISCOUNT_REMOVED",
        userId: user._id,
        context: {
          customerName: moveCustomer.name,
          moveDate: moveDate,
          discountName: discount.name,
        },
        amount,
      });
    } else {
      await ctx.db.insert("newsFeed", {
        body: `**${user.name}** updated discount **${discount.name}** for **${moveCustomer.name}** **(${moveDate})**.`,
        companyId: company._id,
        type: "DISCOUNT_UPDATED",
        userId: user._id,
        context: {
          customerName: moveCustomer.name,
          moveDate: moveDate,
          discountName: discount.name,
        },
        amount,
      });
    }
    return true;
  },
});
