"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CopyPlus, Eye } from "lucide-react";
import {
  formatAccessType,
  formatDateToLong,
  formatMoveSize,
  formatLocationType,
} from "@/frontendUtils/helper";
import type { Doc } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { EnrichedMoveForMover } from "@/types/convex-responses";
import {
  getDisplayedPrice,
  getHourStatusClass,
  getStatusDisplay,
} from "@/frontendUtils/moveHelper";

interface MoveOnlyCardProps {
  move: EnrichedMoveForMover;
  href?: string;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  showOnlyJobIdTag?: boolean;
  className?: string;
  linkDisabled?: boolean;
  onNavigate?: () => void;
}

export default function MoveOnlyCard({
  move,
  href,
  showActions = false,
  onDuplicate,
  showOnlyJobIdTag = false,
  className,
  linkDisabled = false,
  onNavigate,
}: MoveOnlyCardProps) {
  const isMover = Boolean(
    move.moverWageForMove || move.hourStatus !== undefined
  );
  const price = getDisplayedPrice(
    move,
    isMover,
    move.hourStatus,
    move.moverWageForMove
  );
  const { label: displayStatus, color: statusDotColor } = getStatusDisplay(
    move,
    isMover
  );
  const showHourStatus = isMover;
  const hourStatusClass = getHourStatusClass(move.hourStatus);

  const tagsAll = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    formatMoveSize(move.locations[0].moveSize),
    formatAccessType(move.locations[0].accessType),
    formatLocationType(move.locations[0].locationType),
  ].filter(Boolean) as string[];

  const tagsJobOnly = move.jobId ? [`Job ID: ${move.jobId}`] : [];
  const tags = showOnlyJobIdTag ? tagsJobOnly : tagsAll;

  const interactive = !showActions && !linkDisabled && (href || onNavigate);
  const cardBody = (
    <div className="max-w-screen-sm mx-auto">
      <p className="text-grayCustom2">{formatDateToLong(move.moveDate)}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span style={{ color: statusDotColor }}>●</span>
          <span className="truncate">{displayStatus}</span>
          <span className="text-greenCustom font-semibold pl-1">{price}</span>
          {showHourStatus && (
            <span className={`${hourStatusClass} italic`}>
              {move.hourStatus === "incomplete"
                ? "(Estimated)"
                : `(${move.hourStatus})`}
            </span>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-1">
          {tags.map((tag, i) => (
            <Badge interactive={false} key={i}>
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {showActions && (
        <div className="flex gap-4 mt-2 justify-between sm:justify-start">
          <Button
            size="auto"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.();
            }}
          >
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>View</span>
            </div>
          </Button>

          <Button
            size="auto"
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.(move);
            }}
          >
            <div className="flex items-center gap-1">
              <CopyPlus className="w-4 h-4" />
              <span>Duplicate</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );

  const baseClasses =
    "bg-black py-4 px-4 text-white transition-colors duration-200";
  const interactiveClasses =
    !showActions && !linkDisabled
      ? "hover:bg-background2 hover:rounded-lg cursor-pointer"
      : "";

  let wrapper: React.ReactNode;

  if (interactive && href) {
    wrapper = (
      <Link
        href={href}
        className={cn(baseClasses, interactiveClasses)}
        aria-label={`Open move ${move.jobId ?? move._id}`}
        prefetch
      >
        {cardBody}
      </Link>
    );
  } else if (interactive && !href) {
    wrapper = (
      <div
        className={cn(baseClasses, interactiveClasses)}
        role="button"
        tabIndex={0}
        onClick={() => onNavigate?.()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onNavigate?.();
        }}
      >
        {cardBody}
      </div>
    );
  } else {
    wrapper = <div className={cn(baseClasses)}>{cardBody}</div>;
  }

  return (
    <div className={cn("border-b border-grayCustom", className)}>{wrapper}</div>
  );
}
