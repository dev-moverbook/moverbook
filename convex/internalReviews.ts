import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateDocument,
  validateMoveCustomer,
  isIdentityInMove,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { internal } from "./_generated/api";
import { throwConvexError } from "./backendUtils/errors";
import { ClerkRoles } from "@/types/enums";

export const getInternalReview = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"internalReviews"> | null> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    isIdentityInMove(identity, move);

    const internalReview = await ctx.db
      .query("internalReviews")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .first();

    return internalReview;
  },
});

export const createInternalReview = mutation({
  args: {
    moveId: v.id("moves"),
    rating: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, rating } = args;

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    isIdentityInMove(identity, move);

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    await ctx.db.insert("internalReviews", {
      moveId,
      rating,
    });

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "Unkown Date";

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "INTERNAL_REVIEW_COMPLETED",
        companyId: move.companyId,
        body: `**${moveCustomer.name}** **${moveDate}** left a ${rating} star review.`,
        moveId,
        moveCustomerId: move.moveCustomerId,
      },
    });

    return true;
  },
});

export const getInternalReviewByMoveIdInternal = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"internalReviews"> | null> => {
    const { moveId } = args;

    const internalReview = await ctx.db
      .query("internalReviews")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .first();

    return internalReview;
  },
});

export const insertInternalReview = internalMutation({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Id<"internalReviews">> => {
    const { moveId } = args;

    return await ctx.db.insert("internalReviews", {
      moveId,
    });
  },
});

export const updateInternalReview = mutation({
  args: {
    internalReviewId: v.id("internalReviews"),
    updates: v.object({
      rating: v.number(),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { internalReviewId, updates } = args;

    const internalReview = await ctx.db.get(internalReviewId);
    if (!internalReview) {
      throwConvexError(ErrorMessages.INTERNAL_REVIEW_NOT_FOUND, {
        code: "NOT_FOUND",
      });
    }

    const move = await validateDocument(
      ctx.db,
      "moves",
      internalReview.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);
    isIdentityInMove(identity, move);

    await ctx.db.patch(internalReviewId, {
      ...updates,
      updatedAt: Date.now(),
    });
    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "INTERNAL_REVIEW_COMPLETED",
        companyId: move.companyId,
        body: `**${identity.name}** left a ${updates.rating} star rating.`,
        moveId: move._id,
        moveCustomerId: move.moveCustomerId,
      },
    });

    return true;
  },
});
