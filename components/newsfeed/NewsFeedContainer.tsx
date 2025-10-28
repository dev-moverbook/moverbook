"use client";

import NewsFeedCard from "./NewsFeedCard";
import { EnrichedNewsFeed } from "@/types/types";
import { useSlugContext } from "@/contexts/SlugContext";

interface NewsFeedContainerProps {
  newsFeedEvents: EnrichedNewsFeed[];
}

const NewsFeedContainer: React.FC<NewsFeedContainerProps> = ({
  newsFeedEvents,
}) => {
  const { slug } = useSlugContext();

  return (
    <div>
      {newsFeedEvents.map((newsFeedEvent) => {
        const moveId = newsFeedEvent.newsFeedItem.moveId;
        const href = moveId ? `/app/${slug}/moves/${moveId}` : undefined;
        return (
          <NewsFeedCard
            key={newsFeedEvent.newsFeedItem._id}
            newsFeedEvent={newsFeedEvent}
            href={href}
          />
        );
      })}
    </div>
  );
};

export default NewsFeedContainer;
