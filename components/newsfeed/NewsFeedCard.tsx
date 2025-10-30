"use client";

import { DateTime } from "luxon";
import Link from "next/link";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { parseBoldMarkdown } from "@/frontendUtils/pareseUtils";
import { EnrichedNewsFeed } from "@/types/types";
import { getEventEmojis } from "@/frontendUtils/newsFeedHelper";
import UserAvatar from "./NewsFeedAvatar";

interface NewsFeedCardProps {
  newsFeedEvent: EnrichedNewsFeed;
  href?: string | null;
}

const NewsFeedCard: React.FC<NewsFeedCardProps> = ({ newsFeedEvent, href }) => {
  const {
    newsFeedItem: { _creationTime, body, type },
    userImageUrl,
  } = newsFeedEvent;
  const relativeTime = DateTime.fromMillis(_creationTime).toRelative();
  const creationDateFormatted = formatMonthDayLabelStrict(_creationTime);
  const emojis = getEventEmojis(type);

  const cardContent = (
    <div className="flex items-start gap-4 py-3 border-b border-grayCustom w-full px-4  relative">
      <div className="flex flex-col items-center w-10 text-center">
        <UserAvatar userImageUrl={userImageUrl} altText="user" />
        <div className="text-xs text-grayCustom2 mt-1">
          {creationDateFormatted}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base text-white">
              {parseBoldMarkdown(body)}
            </div>
            <div className="text-xs text-grayCustom2">{relativeTime}</div>
          </div>
        </div>
        <div className="absolute right-4 bottom-4 flex gap-1">
          {emojis.map((emojiSrc, i) => (
            <img key={i} src={emojiSrc} alt="event emoji" className="w-8 h-8" />
          ))}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block hover:bg-background2 hover:rounded-md cursor-pointer"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default NewsFeedCard;
