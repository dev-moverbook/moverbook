import { ClerkRoles } from "@/types/enums";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateUser } from "./backendUtils/validate";
import { Id } from "./_generated/dataModel";

export const updateMoverLocation = mutation({
  args: {
    moverId: v.id("users"),
    lat: v.number(),
    lng: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moverId, lat, lng, timestamp } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const userId = identity.convexId as Id<"users">;

    validateUser(await ctx.db.get(userId));

    const existing = await ctx.db
      .query("moverLocations")
      .withIndex("by_moverId", (q) => q.eq("moverId", moverId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lat,
        lng,
        timestamp,
      });
    } else {
      await ctx.db.insert("moverLocations", {
        moverId,
        lat,
        lng,
        timestamp,
      });
    }
    return true;
  },
});
