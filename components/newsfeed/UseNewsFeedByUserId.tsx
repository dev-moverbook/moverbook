"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useNewsFeedByUserId } from "@/hooks/newsfeeds/useActivitesByUserId";
import NewsFeedContainer from "./NewsFeedContainer";

const UseNewsFeedByUserId = () => {
  const { companyId } = useSlugContext();
  const newsFeedEvents = useNewsFeedByUserId(companyId);

  if (!newsFeedEvents) {
    return null;
  }
  return <NewsFeedContainer newsFeedEvents={newsFeedEvents} />;
};

export default UseNewsFeedByUserId;
