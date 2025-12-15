"use client";

import { DateTime } from "luxon";
import Link from "next/link";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { parseBoldMarkdown } from "@/frontendUtils/pareseUtils";
import { EnrichedNewsFeed, MoveStatus } from "@/types/types";
import { getEventEmojis } from "@/frontendUtils/newsFeedHelper";
import UserAvatar from "./NewsFeedAvatar";
import Image from "next/image";
import { formatCurrency, getMoveStatusFromBody } from "@/frontendUtils/helper";

interface NewsFeedCardProps {
  newsFeedEvent: EnrichedNewsFeed;
  href?: string | null;
}

const NewsFeedCard: React.FC<NewsFeedCardProps> = ({ newsFeedEvent, href }) => {
  const {
    newsFeedItem: { _creationTime, body, type, amount },
    userImageUrl,
  } = newsFeedEvent;

  let moveStatus: MoveStatus | undefined;

  if (type === "MOVE_STATUS_UPDATED") {
    moveStatus = getMoveStatusFromBody(body);
  }

  const relativeTime = DateTime.fromMillis(_creationTime).toRelative();
  const creationDateFormatted = formatMonthDayLabelStrict(_creationTime);

  const showEmojis = amount === undefined;
  const emojis = showEmojis ? getEventEmojis(type, moveStatus) : [];

  const displayAmount =
    amount === null || amount === undefined ? "TBD" : formatCurrency(amount);
  const amountColorClass =
    amount === null || amount === undefined
      ? ""
      : amount >= 0
        ? "text-green-600"
        : "text-red-600";

  const cardContent = (
    <div className="flex items-start gap-4 py-3 border-b border-grayCustom w-full px-4 relative">
      <div className="flex flex-col items-center w-10 text-center">
        <UserAvatar userImageUrl={userImageUrl} altText="user" />
        <div className="text-xs text-grayCustom2 mt-1">
          {creationDateFormatted}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-white leading-tight">
              {parseBoldMarkdown(body)}
            </div>
            <div className="text-xs text-grayCustom2">{relativeTime}</div>
          </div>
        </div>

        <div className="absolute right-4 bottom-4 flex gap-1 items-center">
          {showEmojis ? (
            emojis.map((emojiSrc, i) => (
              <Image
                key={i}
                src={emojiSrc}
                alt="event emoji"
                width={32}
                height={32}
              />
            ))
          ) : (
            <span className={`font-semibold text-lg ${amountColorClass}`}>
              {displayAmount}
            </span>
          )}
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
