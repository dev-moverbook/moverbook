import React from "react";
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

interface MoveCardProps {
  move: Doc<"move">;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  onClick?: (moveId: Id<"move">) => void;
  /** If true, only render the Job ID tag (when available). */
  showOnlyJobIdTag?: boolean;
  /** Extra classes for the OUTER wrapper div */
  className?: string;
}

const MoveOnlyCard: React.FC<MoveCardProps> = ({
  move,
  showActions = false,
  onDuplicate,
  onClick,
  showOnlyJobIdTag = false,
  className,
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

  return (
    <div
      onClick={() => onClick?.(move._id)}
      className={cn("border-b border-grayCustom", className)}
    >
      <div
        className={cn(
          "bg-black py-4 px-4  text-white transition-colors duration-200",
          onClick ? "hover:bg-background2 cursor-pointer" : ""
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
        </div>

        {showActions && (
          <div className="flex gap-4 mt-2 justify-between sm:justify-start">
            <Button
              size="auto"
              variant="link"
              onClick={(e) => {
                e.stopPropagation();
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
};

export default MoveOnlyCard;
