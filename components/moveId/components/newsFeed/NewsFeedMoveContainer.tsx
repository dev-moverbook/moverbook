"use client";

import NewsFeedCard from "@/components/newsfeed/NewsFeedCard";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { EnrichedNewsFeed } from "@/types/types";

interface NewsFeedMoveContainerProps {
  newsFeedEvents: EnrichedNewsFeed[];
}

const NewsFeedMoveContainer = ({
  newsFeedEvents,
}: NewsFeedMoveContainerProps) => {
  return (
    <SectionContainer>
      {newsFeedEvents.map((newsFeedEvent) => {
        return (
          <NewsFeedCard
            key={newsFeedEvent.newsFeedItem._id}
            newsFeedEvent={newsFeedEvent}
          />
        );
      })}
    </SectionContainer>
  );
};

export default NewsFeedMoveContainer;
