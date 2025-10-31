"use client";

import NewsFeedCard from "./NewsFeedCard";
import { EnrichedNewsFeed } from "@/types/types";
import { useSlugContext } from "@/contexts/SlugContext";
import { getNewsFeedEventHref } from "@/frontendUtils/newsFeedHelper";

interface NewsFeedContainerProps {
  newsFeedEvents: EnrichedNewsFeed[];
}

const NewsFeedContainer: React.FC<NewsFeedContainerProps> = ({
  newsFeedEvents,
}) => {
  const { slug } = useSlugContext();

  if (newsFeedEvents.length === 0) {
    return (
      <div className="text-center text-grayCustom2 mt-4">
        No news feed events found. Create a new move to see news feed events.
      </div>
    );
  }

  return (
    <div>
      {newsFeedEvents.map((newsFeedEvent) => {
        const href = getNewsFeedEventHref(slug, newsFeedEvent);
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
