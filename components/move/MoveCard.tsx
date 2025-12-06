"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDateToLong, formatLocationType } from "@/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";
import { MoverWageForMove, HourStatus } from "@/types/types";
import {
  getDisplayedPrice,
  getHourStatusClass,
  getStatusDisplay,
} from "@/frontendUtils/moveHelper";
import { RepAvatar } from "../shared/avatars/RepAvatar";
import { MoveCardActions } from "./MoveCardActions";

interface MoveCardProps {
  move: Doc<"moves">;
  moveCustomer: Doc<"users"> | null;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"moves">) => void;
  salesRep: Doc<"users"> | null;
  isMover?: boolean;
  hourStatus?: HourStatus;
  moverWageDisplay?: MoverWageForMove | null;
  navigateTo?: string;
  messagesHref?: string;
  customerHref?: string;
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
  navigateTo,
  messagesHref,
  customerHref,
}) => {
  const name = moveCustomer?.name ?? "No name";
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
      className={`
        py-4 px-4 text-white shadow-md rounded-lg  
        ${!showActions ? "hover:bg-background2/80 transition-colors duration-200" : ""}
      `}
    >
      <div className="max-w-screen-sm mx-auto">
        <div className="flex items-stretch justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <p className="text-grayCustom2 text-sm">
              {formatDateToLong(move.moveDate)}
            </p>
            <h3 className="text-lg font-medium truncate">{name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: statusDotColor }}>●</span>
              <span className="truncate">{displayStatus}</span>
              <span className="text-greenCustom font-semibold pl-1">
                {price}
              </span>
              {showHourStatus && hourStatus && (
                <span className={`${hourStatusClass} italic`}>
                  ({hourStatus === "incomplete" ? "est." : hourStatus})
                </span>
              )}
            </div>
          </div>

          <RepAvatar salesRep={salesRep} />
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {tags.map((tag, i) => (
            <Badge key={i} interactive={false} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {showActions && (
          <div className="mt-4">
            <MoveCardActions
              onMessagesClick={
                messagesHref
                  ? () => window.open(messagesHref, "_blank")
                  : undefined
              }
              onViewCustomerClick={
                customerHref
                  ? () => window.open(customerHref, "_blank")
                  : undefined
              }
              onDuplicate={onDuplicate ? () => onDuplicate(move) : undefined}
              move={move}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (showActions) {
    return body;
  }

  if (!navigateTo) {
    return body;
  }

  return (
    <Link
      href={navigateTo}
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        role="link"
        tabIndex={0}
        className="cursor-pointer outline-none"
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.stopPropagation();
          }
        }}
      >
        {body}
      </div>
    </Link>
  );
};

export default MoveCard;
