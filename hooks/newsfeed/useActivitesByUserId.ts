"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { EnrichedNewsFeed } from "@/types/types";

export const useNewsFeedByUserId = (
  companyId: Id<"companies">
): EnrichedNewsFeed[] | undefined => {
  const response = useQuery(api.newsfeed.getActivitiesForUser, {
    companyId,
  });

  return response;
};
