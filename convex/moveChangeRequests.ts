import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { internalQuery, mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateDocExists, isIdentityInMove } from "./backendUtils/validate";
import {
  ChangeRequestStatusConvex,
  LocationConvex,
  MoveItemConvex,
} from "./schema";
import { canPublicEditMove } from "@/frontendUtils/timeUtils";
import { throwConvexError } from "./backendUtils/errors";

export const insertMoveUpdate = mutation({
  args: {
    moveId: v.id("moves"),
    requestedLocations: v.optional(v.array(LocationConvex)),
    requestedMoveItems: v.optional(v.array(MoveItemConvex)),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, requestedLocations, requestedMoveItems } = args;

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const move = validateDocExists(
      "moves",
      await ctx.runQuery(internal.moves.getMoveByIdInternal, {
        moveId,
      }),
      ErrorMessages.MOVE_NOT_FOUND
    );
    isIdentityInMove(identity, move);

    if (!canPublicEditMove(move.moveDate)) {
      throwConvexError(
        "Move can no longer be edited on or after the move date",
        {
          code: "BAD_REQUEST",
          showToUser: true,
        }
      );
    }

    await ctx.db.insert("moveChangeRequests", {
      moveId,
      status: "pending",
      requestedLocations,
      requestedMoveItems,
      updatedAt: Date.now(),
    });

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_MOVE_UPDATED",
        body: `**${identity.name}** **${moveDate}** made an update.`,
        companyId: move.companyId,
        moveId,
        moveCustomerId: identity.convexId as Id<"users">,
      },
    });
    return true;
  },
});

export const updateCustomerAcknowledgedAt = mutation({
  args: {
    moveChangeRequestId: v.id("moveChangeRequests"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveChangeRequestId } = args;

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const moveChangeRequest = validateDocExists(
      "moveChangeRequests",
      await ctx.db.get(moveChangeRequestId),
      "Move change request not found"
    );

    const move = validateDocExists(
      "moves",
      await ctx.runQuery(internal.moves.getMoveByIdInternal, {
        moveId: moveChangeRequest.moveId,
      }),
      ErrorMessages.MOVE_NOT_FOUND
    );
    isIdentityInMove(identity, move);

    isIdentityInMove(identity, move);

    const now = Date.now();

    await ctx.db.patch(moveChangeRequestId, {
      customerAcknowledgedAt: now,
      updatedAt: now,
    });

    return true;
  },
});

export const processMoveChangeRequest = mutation({
  args: {
    moveChangeRequestId: v.id("moveChangeRequests"),
    updates: v.object({
      status: ChangeRequestStatusConvex,
      rejectionNotes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveChangeRequestId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const moveChangeRequest = validateDocExists(
      "moveChangeRequests",
      await ctx.db.get(moveChangeRequestId),
      "Move change request not found"
    );

    const move = validateDocExists(
      "moves",
      await ctx.runQuery(internal.moves.getMoveByIdInternal, {
        moveId: moveChangeRequest.moveId,
      }),
      ErrorMessages.MOVE_NOT_FOUND
    );
    isIdentityInMove(identity, move);

    const now = Date.now();

    await ctx.db.patch(moveChangeRequestId, {
      ...updates,
      updatedAt: now,
    });

    if (updates.status === "approved") {
      const quote = await ctx.runQuery(internal.quotes.getQuoteByMoveId, {
        moveId: move._id,
      });

      if (quote) {
        await ctx.runMutation(internal.quotes.updateQuote, {
          quoteId: quote._id,
          updates: {
            status: "pending",
            customerSignature: undefined,
            customerSignedAt: undefined,
            repSignature: undefined,
            repSignedAt: undefined,
          },
        });
      }
    }

    return true;
  },
});

export const getMoveChangeRequestsByMoveId = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"moveChangeRequests">[]> => {
    const { moveId } = args;

    const moveChangeRequests = await ctx.db
      .query("moveChangeRequests")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .collect();

    return moveChangeRequests;
  },
});
