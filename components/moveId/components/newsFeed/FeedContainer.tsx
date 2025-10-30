"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import { useNewsFeedByMoveId } from "@/hooks/newsfeeds/useActivitiesByMoveId";
import NewsFeedMoveContainer from "./NewsFeedMoveContainer";

const FeedLoader = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const newsFeedEvents = useNewsFeedByMoveId(move._id);

  if (!newsFeedEvents) {
    return null;
  }

  return <NewsFeedMoveContainer newsFeedEvents={newsFeedEvents} />;
};

export default FeedLoader;
