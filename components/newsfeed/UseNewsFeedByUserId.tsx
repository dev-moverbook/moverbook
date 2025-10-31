"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useNewsFeedByUserId } from "@/hooks/newsfeeds/useActivitesByUserId";
import NewsFeedContainer from "./NewsFeedContainer";
import InfiniteScrollLoader from "../shared/loading/InfiniteScrollLoader";
import { useInfiniteScrollObserver } from "@/hooks/utils";

const UseNewsFeedByUserId = () => {
  const { companyId } = useSlugContext();
  const { newsFeedEvents, status, loadMore } = useNewsFeedByUserId(companyId);

  const loaderRef = useInfiniteScrollObserver({
    onLoadMore: () => loadMore(10),
    canLoadMore: status === "CanLoadMore",
  });

  if (!newsFeedEvents) {
    return null;
  }
  return (
    <div className="pb-10">
      <NewsFeedContainer newsFeedEvents={newsFeedEvents} />
      <div ref={loaderRef} className="h-10" />
      <InfiniteScrollLoader status={status} />
    </div>
  );
};

export default UseNewsFeedByUserId;
