import { ClerkRoles } from "@/types/enums";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInCompanyConvex,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { ErrorMessages } from "@/types/errors";

export const updateMoverLocation = mutation({
  args: {
    moveId: v.id("moves"),
    lat: v.number(),
    lng: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, lat, lng, timestamp } = args;

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

    const validatedUser = validateUser(
      await ctx.db.get(identity.convexId as Id<"users">)
    );
    isUserInCompanyConvex(validatedUser, move.companyId);

    const existing = await ctx.db
      .query("moverLocations")
      .withIndex("by_moveId", (q) => q.eq("moveId", moveId))
      .unique();
    if (!existing) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: ErrorMessages.MOVER_LOCATION_NOT_FOUND,
      });
    }

    await ctx.db.patch(existing._id, {
      lat,
      lng,
      timestamp,
    });
    return true;
  },
});

export const stopMoverLocationSharing = mutation({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);
    const userId = identity.convexId as Id<"users">;

    const validatedUser = validateUser(await ctx.db.get(userId));
    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      move.moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    isUserInCompanyConvex(validatedUser, move.companyId);

    const moveLocation = await ctx.db
      .query("moverLocations")
      .withIndex("by_moveId", (q) => q.eq("moveId", moveId))
      .unique();

    if (!moveLocation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: ErrorMessages.MOVER_LOCATION_NOT_FOUND,
      });
    }

    await Promise.all([
      ctx.db.patch(moveLocation._id, { isOn: false }),
      ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "LOCATION_SHARING_STOPPED",
          companyId: move.companyId,
          body: `**${validatedUser.name}** stopped sharing location for move **${moveCustomer.name}**`,
          context: {
            customerName: moveCustomer.name,
            moverName: validatedUser.name,
            moverLocationId: moveLocation._id,
          },
          moveId,
          userId: validatedUser._id,
        },
      }),
    ]);

    return true;
  },
});

export const inserMoverLocationSharing = mutation({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const userId = identity.convexId as Id<"users">;

    const validatedUser = validateUser(await ctx.db.get(userId));

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      move.moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    isUserInCompanyConvex(validatedUser, move.companyId);

    const existing = await ctx.db
      .query("moverLocations")
      .withIndex("by_moveId", (q) => q.eq("moveId", moveId))
      .unique();

    let moveLocationId: Id<"moverLocations"> | undefined = existing?._id;

    if (!existing) {
      moveLocationId = await ctx.db.insert("moverLocations", {
        moveId,
        isOn: true,
      });
    } else if (moveLocationId) {
      await ctx.db.patch(moveLocationId, {
        isOn: true,
      });
    }

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "LOCATION_SHARING_STARTED",
        companyId: move.companyId,
        body: `**${validatedUser.name}** shared their location for move **${moveCustomer.name}**`,
        context: {
          customerName: moveCustomer.name,
          moverName: validatedUser.name,
          moverLocationId: moveLocationId!,
        },
        moveId,
        userId: validatedUser._id,
      },
    });

    return true;
  },
});

export const getMoverLocation = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"moverLocations"> | null> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const validatedUser = validateUser(
      await ctx.db.get(identity.convexId as Id<"users">)
    );

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    isUserInCompanyConvex(validatedUser, move.companyId);

    const moverLocation = await ctx.db
      .query("moverLocations")
      .withIndex("by_moveId", (q) => q.eq("moveId", moveId))
      .unique();

    return moverLocation;
  },
});
