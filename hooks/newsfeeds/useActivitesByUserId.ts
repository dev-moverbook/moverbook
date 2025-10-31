import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { EnrichedNewsFeed } from "@/types/types";

export const useNewsFeedByUserId = (
  companyId: Id<"companies">
): {
  newsFeedEvents: EnrichedNewsFeed[];
  status: string;
  loadMore: (n: number) => void;
} => {
  const {
    results: newsFeedEvents = [],
    status,
    loadMore,
  } = usePaginatedQuery(
    api.newsfeeds.getActivitiesForUserPaginated,
    { companyId },
    { initialNumItems: 10 }
  );

  return { newsFeedEvents, status, loadMore };
};
