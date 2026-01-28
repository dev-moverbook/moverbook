"use client";

import { RecentMoveMessageSummary } from "@/types/types";
import {
  formatMonthDayTimestamp,
  getInitials,
  getStatusColor,
} from "@/frontendUtils/helper";
import { useSlugContext } from "@/contexts/SlugContext";
import ListRowLink from "../shared/link/ListRowLink";

interface MessageCardProps {
  recentMoveMessageSummary: RecentMoveMessageSummary;
  slug: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  recentMoveMessageSummary,
  slug,
}) => {
  const { customerName, lastMessage, timestamp, status, moveId } =
    recentMoveMessageSummary;
  const { timeZone } = useSlugContext();

  const initials = getInitials(customerName);
  const statusColor = getStatusColor(status);

  return (
    <ListRowLink href={`/app/${slug}/moves/${moveId}/messages`}>
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium">
          {initials}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white truncate">
              {customerName}
            </span>
            <span style={{ color: statusColor }} className="shrink-0">
              ●
            </span>
          </div>
          <span className="text-grayCustom2 truncate ">{lastMessage}</span>
        </div>
      </div>

      <span className="text-grayCustom2  shrink-0 ml-4 text-right">
        {formatMonthDayTimestamp(timestamp, timeZone)}
      </span>
    </ListRowLink>
  );
};

export default MessageCard;
