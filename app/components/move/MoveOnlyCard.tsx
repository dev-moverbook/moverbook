"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CopyPlus, Eye } from "lucide-react";
import {
  formatAccessType,
  formatDateToLong,
  formatMoveSize,
  formatLocationType,
  formatPriceRange,
  getMoveCostRange,
  getStatusColor,
} from "@/app/frontendUtils/helper";
import { useRouter } from "next/navigation";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface MoveOnlyCardProps {
  move: Doc<"move">;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  showOnlyJobIdTag?: boolean;
  className?: string;
  asCustomerLink?: boolean;
  customerId?: Id<"moveCustomers">;
  linkDisabled?: boolean;
  onNavigate?: () => void;
}

const MoveOnlyCard: React.FC<MoveOnlyCardProps> = ({
  move,
  showActions = false,
  onDuplicate,
  showOnlyJobIdTag = false,
  className,
  asCustomerLink = false,
  customerId,
  linkDisabled = false,
  onNavigate,
}) => {
  const { moveDate, moveStatus, _id } = move;
  const { slug } = useSlugContext();
  const router = useRouter();

  const allTags = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    formatMoveSize(move.locations[0].moveSize),
    formatAccessType(move.locations[0].accessType),
    formatLocationType(move.locations[0].locationType),
  ].filter(Boolean) as string[];

  const jobIdTag = move.jobId ? [`Job ID: ${move.jobId}`] : [];
  const tags = showOnlyJobIdTag ? jobIdTag : allTags;

  const [low, high] = getMoveCostRange(move);
  const price = formatPriceRange(low, high);

  const hrefLink =
    asCustomerLink && customerId
      ? `/app/${slug}/customer/${customerId}`
      : `/app/${slug}/moves/${_id}`;

  const inner = (
    <div
      className={cn(
        "bg-black py-4 px-4 text-white transition-colors duration-200",
        !showActions && !linkDisabled
          ? "hover:bg-background2 hover:rounded-lg"
          : ""
      )}
    >
      <div className="max-w-screen-sm mx-auto">
        <p className="text-grayCustom2">{formatDateToLong(moveDate)}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span style={{ color: getStatusColor(moveStatus) }}>●</span>
            <span>{moveStatus}</span>
            <span className="text-greenCustom font-medium pl-2">{price}</span>
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
                router.push(`/app/${slug}/moves/${_id}`);
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

  const outer = (
    <div className={cn("border-b border-grayCustom", className)}>{inner}</div>
  );

  if (!showActions && !linkDisabled) {
    return (
      <Link href={hrefLink} onClick={onNavigate}>
        {outer}
      </Link>
    );
  }

  return outer;
};

export default MoveOnlyCard;
