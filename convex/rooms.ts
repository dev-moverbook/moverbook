import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
  validateUniqueRoomName,
} from "./backendUtils/validate";
import { GetActiveRoomsResponse } from "@/types/convex-responses";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { shouldExposeError } from "./backendUtils/helper";
import { Id } from "./_generated/dataModel";

// not used
export const getActiveRoomsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetActiveRoomsResponse> => {
    const { companyId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = await validateCompany(ctx.db, companyId);
      isUserInOrg(identity, company.clerkOrganizationId);

      const activeRooms = await ctx.db
        .query("rooms")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          rooms: activeRooms,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error("Internal Error:", errorMessage, error);

      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: shouldExposeError(errorMessage)
          ? errorMessage
          : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});

export const createRoom = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, name } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    await validateUniqueRoomName(ctx, companyId, name);

    await ctx.db.insert("rooms", {
      companyId,
      name,
      isActive: true,
      isStarter: false,
    });

    return true;
  },
});

export const updateRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { roomId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const room = await validateDocument(
      ctx.db,
      "rooms",
      roomId,
      ErrorMessages.ROOM_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, room.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    if (updates.name) {
      await validateUniqueRoomName(ctx, room.companyId, updates.name);
    }

    await ctx.db.patch(roomId, updates);

    return true;
  },
});

export const resetRoomsAndCategoriesAndItems = mutation({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Id<"companies">> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const rooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();

    const roomUpdatePromises = rooms.map((room) =>
      ctx.db.patch(room._id, { isActive: room.isStarter })
    );

    await Promise.all(roomUpdatePromises);

    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();

    const categoryUpdatePromises = categories.map((category) =>
      ctx.db.patch(category._id, { isActive: category.isStarter })
    );

    await Promise.all(categoryUpdatePromises);

    const items = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();

    const itemUpdatePromises = items.map((item) =>
      ctx.db.patch(item._id, { isActive: item.isStarter })
    );

    await Promise.all(itemUpdatePromises);

    return companyId;
  },
});
