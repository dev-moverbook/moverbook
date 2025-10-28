import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { EnrichedNewsFeed } from "@/types/types";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "./_generated/dataModel";
import {
  getUserImageMap,
  mergeNewsFeedAndImages,
} from "./backendUtils/newsFeedHelper";

export const getActivitiesForUser = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<EnrichedNewsFeed[]> => {
    const { companyId } = args;
    const authenticatedUser = await requireAuthenticatedUser(ctx);
    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(authenticatedUser, company.clerkOrganizationId);

    const clerkUserId = authenticatedUser.id as string;
    const userRecord = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
        .unique()
    );

    let newsFeedItems: Doc<"newsFeed">[];
    if (userRecord.role === ClerkRoles.MOVER) {
      newsFeedItems = await ctx.db
        .query("newsFeed")
        .withIndex("by_userId", (q) => q.eq("userId", userRecord._id))
        .order("desc")
        .collect();
    } else {
      newsFeedItems = await ctx.db
        .query("newsFeed")
        .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
        .order("desc")
        .collect();
    }

    const uniqueUserIds = Array.from(
      new Set(
        newsFeedItems
          .map((event) => event.userId)
          .filter((userId): userId is Id<"users"> => userId !== undefined)
      )
    );

    const userImageMap = await getUserImageMap(ctx, uniqueUserIds);

    return mergeNewsFeedAndImages(newsFeedItems, userImageMap);
  },
});

export const getActivitiesByMoveId = query({
  args: {
    moveId: v.id("move"),
  },
  handler: async (ctx, args): Promise<EnrichedNewsFeed[]> => {
    const { moveId } = args;
    const identity = await requireAuthenticatedUser(ctx);
    const move = await validateDocument(
      ctx.db,
      "move",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    let newsFeedItems: Doc<"newsFeed">[];
    if (identity.role === ClerkRoles.MOVER) {
      const user = validateUser(
        await ctx.db
          .query("users")
          .withIndex("by_clerkUserId", (q) =>
            q.eq("clerkUserId", identity.id as string)
          )
          .unique()
      );
      newsFeedItems = await ctx.db
        .query("newsFeed")
        .withIndex("by_moveId_userId", (q) =>
          q.eq("moveId", moveId).eq("userId", user._id)
        )
        .order("desc")
        .collect();
    } else {
      newsFeedItems = await ctx.db
        .query("newsFeed")
        .withIndex("by_moveId", (q) => q.eq("moveId", moveId))
        .order("desc")
        .collect();
    }

    const uniqueUserIds = Array.from(
      new Set(
        newsFeedItems
          .map((event) => event.userId)
          .filter((userId): userId is Id<"users"> => userId !== undefined)
      )
    );

    const userImageMap = await getUserImageMap(ctx, uniqueUserIds);

    return mergeNewsFeedAndImages(newsFeedItems, userImageMap);
  },
});
