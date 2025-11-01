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

  return (
    <div className="">
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
