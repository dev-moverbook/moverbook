import { QueryCtx } from "@/convex/_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { EnrichedNewsFeed } from "@/types/types";

export async function getUserImageMap(
  ctx: QueryCtx,
  userIds: Id<"users">[]
): Promise<Map<string, string | null>> {
  const users = await ctx.db.query("users").collect();
  const map = new Map<string, string | null>();
  for (const user of users) {
    if (userIds.includes(user._id)) {
      map.set(user._id, user.imageUrl ?? null);
    }
  }
  return map;
}

export function mergeNewsFeedAndImages(
  newsFeedItems: Doc<"newsFeed">[],
  userImageMap: Map<string, string | null>
): EnrichedNewsFeed[] {
  return newsFeedItems.map((item) => ({
    newsFeedItem: item,
    userImageUrl: item.userId ? (userImageMap.get(item.userId) ?? null) : null,
  }));
}
