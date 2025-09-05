"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CopyPlus, Eye } from "lucide-react";
import {
  formatAccessType,
  formatDateToLong,
  formatMoveSize,
  formatLocationType,
} from "@/app/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { EnrichedMoveForMover } from "@/types/convex-responses";
import {
  getDisplayedPrice,
  getHourStatusClass,
  getStatusDisplay,
} from "@/app/frontendUtils/moveHelper";

interface MoveOnlyCardProps {
  move: EnrichedMoveForMover;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  showOnlyJobIdTag?: boolean;
  className?: string;
  linkDisabled?: boolean;
  onNavigate?: () => void;
}

const MoveOnlyCard: React.FC<MoveOnlyCardProps> = ({
  move,
  showActions = false,
  onDuplicate,
  showOnlyJobIdTag = false,
  className,
  linkDisabled = false,
  onNavigate,
}) => {
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

  const inner = (
    <div
      className={cn(
        "bg-black py-4 px-4 text-white transition-colors duration-200",
        !showActions && !linkDisabled
          ? "hover:bg-background2 hover:rounded-lg cursor-pointer"
          : ""
      )}
      onClick={() => {
        if (!showActions && !linkDisabled) onNavigate?.();
      }}
    >
      <div className="max-w-screen-sm mx-auto">
        <p className="text-grayCustom2">{formatDateToLong(move.moveDate)}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ color: statusDotColor }}>●</span>
            <span className="truncate">{displayStatus}</span>
            <span className="text-greenCustom font-semibold pl-1">{price}</span>
            {showHourStatus && (
              <span className={`${hourStatusClass} italic`}>
                (
                {move.hourStatus === "incomplete"
                  ? "Estimated"
                  : move.hourStatus}
                )
              </span>
            )}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
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
    </div>
  );

  return (
    <div className={cn("border-b border-grayCustom", className)}>{inner}</div>
  );
};

export default MoveOnlyCard;
