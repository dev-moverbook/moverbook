import { v } from "convex/values";
import { action, internalQuery, mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { ClerkRoles } from "@/types/enums";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
  validateMoveCustomer,
  validateDocExists,
  validateUser,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { internal } from "./_generated/api";

export const getInternalReview = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"internalReviews"> | null> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

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

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

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
        context: {
          customerName: moveCustomer.name,
          moveDate,
          rating,
        },
        moveCustomerId: move.moveCustomerId,
      },
    });

    return true;
  },
});
``;

export const sendInternalReview = action({
  args: {
    moveId: v.id("moves"),
    channel: v.union(v.literal("email"), v.literal("sms")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId: args.moveId,
    });
    const validatedMove = validateDocExists(
      "moves",
      move,
      ErrorMessages.MOVE_NOT_FOUND
    );

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      {
        companyId: validatedMove.companyId,
      }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByClerkIdInternal, {
        clerkUserId: identity.id as string,
      })
    );

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: validatedMove.moveCustomerId,
      }
    );

    const validatedMoveCustomer = validateDocExists(
      "moveCustomers",
      moveCustomer,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    const internalReview = await ctx.runQuery(
      internal.internalReviews.getInternalReviewByMoveIdInternal,
      {
        moveId: validatedMove._id,
      }
    );
    const validatedInternalReview = validateDocExists(
      "internalReviews",
      internalReview,
      ErrorMessages.INTERNAL_REVIEW_NOT_FOUND
    );

    if (args.channel === "email") {
      // TODO: Send waiver email
    } else if (args.channel === "sms") {
      // TODO: Send waiver SMS
    }
    const moveDate = validatedMove.moveDate
      ? formatMonthDayLabelStrict(validatedMove.moveDate)
      : "TBD";
    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "INTERNAL_REVIEW_SENT",
        companyId: validatedCompany._id,
        body: `**${user.name}** sent internal review to **${validatedMoveCustomer.name}** **${moveDate}** via ${args.channel}`,
        moveId: validatedMove._id,
        context: {
          customerName: validatedMoveCustomer.name,
          deliveryType: args.channel,
          moveDate,
          salesRepName: user.name,
          internalReviewId: validatedInternalReview._id,
        },
        userId: user._id,
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
