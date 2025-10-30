"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { EnrichedNewsFeed } from "@/types/types";

export const useNewsFeedByMoveId = (
  moveId: Id<"moves">
): EnrichedNewsFeed[] | undefined => {
  const response = useQuery(api.newsfeeds.getActivitiesByMoveId, {
    moveId,
  });

  return response;
};
