"use client";

import React from "react";
import { RecentMoveMessageSummary } from "@/types/types";
import {
  formatMonthDayTimestamp,
  getInitials,
  getStatusColor,
} from "@/app/frontendUtils/helper";
import { useSlugContext } from "@/app/contexts/SlugContext";
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
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium">
          {initials}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white">{customerName}</span>
            <span style={{ color: statusColor }}>●</span>
          </div>
          <span className=" text-grayCustom2 truncate">{lastMessage}</span>
        </div>
      </div>

      {/* Right: date */}
      <span className="text-grayCustom2">
        {formatMonthDayTimestamp(timestamp, timeZone)}
      </span>
    </ListRowLink>
  );
};

export default MessageCard;
