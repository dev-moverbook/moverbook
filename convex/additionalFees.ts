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
import { internal } from "./_generated/api";

export const createAdditionalFee = mutation({
  args: {
    moveId: v.id("moves"),
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
      "moves",
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

    const additionalFeeId = await ctx.db.insert("additionalFees", {
      moveId,
      name,
      price,
      quantity,
      feeId,
      isActive: true,
    });

    const amount = price * quantity;

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "FEE_ADDED",
        body: `**${user.name}** added fee **${name}** to **${moveCustomer.name}** **${moveDate}**.`,
        companyId: company._id,
        userId: user._id,
        amount,
        context: {
          customerName: moveCustomer.name,
          feeId: additionalFeeId,
          feeAmount: amount,
          feeName: name,
          moverName: user.name,
          moveDate,
        },
        moveId,
      },
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
      "moves",
      fee.moveId,
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

    await ctx.db.patch(additionalFeeId, updates);

    const updatedFee = await validateDocument(
      ctx.db,
      "additionalFees",
      additionalFeeId,
      ErrorMessages.ADDITIONAL_FEE_NOT_FOUND
    );

    if (updates.isActive === false) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "FEE_REMOVED",
          companyId: company._id,
          userId: user._id,
          body: `**${user.name}** removed fee **${fee.name}** from **${moveCustomer.name}** **${moveDate}**.`,
          amount: fee.price * fee.quantity * -1,
          context: {
            customerName: moveCustomer.name,
            feeName: fee.name,
            feeAmount: fee.price * fee.quantity,
            feeId: additionalFeeId,
            moverName: user.name,
            moveDate,
          },
          moveId: move._id,
        },
      });
    } else {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "FEE_UPDATED",
          companyId: company._id,
          userId: user._id,
          body: `**${user.name}** updated fee **${updatedFee.name}** for **${moveCustomer.name}** **${moveDate}**.`,
          amount: updatedFee.price * updatedFee.quantity,
          context: {
            customerName: moveCustomer.name,
            feeName: updatedFee.name,
            feeAmount: updatedFee.price * updatedFee.quantity,
            feeId: additionalFeeId,
            moverName: user.name,
            moveDate,
          },
          moveId: move._id,
        },
      });
    }

    return true;
  },
});
