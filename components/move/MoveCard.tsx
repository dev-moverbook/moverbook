"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDateToLong, formatLocationType } from "@/frontendUtils/helper";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { MoverWageForMove, HourStatus } from "@/types/types";
import {
  getDisplayedPrice,
  getHourStatusClass,
  getStatusDisplay,
} from "@/frontendUtils/moveHelper";
import { RepAvatar } from "../shared/avatars/RepAvatar";
import { MoveCardActions } from "./MoveCardActions";

interface MoveCardProps {
  move: Doc<"move">;
  moveCustomer: Doc<"moveCustomers"> | null;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  salesRep: Doc<"users"> | null;
  isMover?: boolean;
  hourStatus?: HourStatus;
  moverWageDisplay?: MoverWageForMove | null;
  onMessagesClick?: () => void;
  onViewCustomerClick?: () => void;
  onCardClick?: (moveId: Id<"move">) => void;
}

const MoveCard: React.FC<MoveCardProps> = ({
  move,
  moveCustomer,
  showActions = false,
  onDuplicate,
  salesRep,
  isMover = false,
  hourStatus,
  moverWageDisplay,
  onMessagesClick,
  onViewCustomerClick,
  onCardClick,
}) => {
  const name = moveCustomer?.name;
  const tags = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    formatLocationType(move.locations[0].locationType),
  ].filter(Boolean) as string[];

  const price = getDisplayedPrice(move, isMover, hourStatus, moverWageDisplay);
  const { label: displayStatus, color: statusDotColor } = getStatusDisplay(
    move,
    isMover
  );

  const showHourStatus = isMover;

  const hourStatusClass = getHourStatusClass(hourStatus);

  const body = (
    <div
      className={`py-4 px-4 text-white shadow-md ${
        !showActions
          ? "hover:bg-background2 transition-colors duration-200"
          : ""
      }`}
    >
      <div className="max-w-screen-sm mx-auto">
        <div className="flex items-stretch justify-between gap-4">
          {/* --- LEFT (Details) --- */}
          <div className="flex flex-col min-w-0">
            <p className="text-grayCustom2">
              {formatDateToLong(move.moveDate)}
            </p>
            <h3 className="text-lg font-medium truncate">
              {name ?? "No name"}
            </h3>
            <div className="flex items-center gap-1 min-w-0">
              <span style={{ color: statusDotColor }}>●</span>
              <span className="truncate">{displayStatus}</span>
              <span className="text-greenCustom font-semibold pl-1">
                {price}
              </span>
              {showHourStatus && (
                <span className={`${hourStatusClass} italic`}>
                  ({hourStatus === "incomplete" ? "est." : hourStatus})
                </span>
              )}
            </div>
          </div>

          {/* --- RIGHT (Rep) --- */}
          <RepAvatar salesRep={salesRep} />
        </div>
        {/* Tags */}
        <div className="flex gap-1 flex-wrap mt-1">
          {tags.map((tag, i) => (
            <Badge interactive={false} key={i}>
              {tag}
            </Badge>
          ))}
        </div>
        {showActions && (
          <MoveCardActions
            onMessagesClick={onMessagesClick}
            onViewCustomerClick={onViewCustomerClick}
            onDuplicate={onDuplicate}
            move={move}
          />
        )}{" "}
      </div>
    </div>
  );

  if (showActions) return body;

  if (onCardClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onCardClick(move._id)}
        onKeyDown={(e) => e.key === "Enter" && onCardClick(move._id)}
        className="cursor-pointer"
      >
        {body}
      </div>
    );
  }

  return body;
};

export default MoveCard;
