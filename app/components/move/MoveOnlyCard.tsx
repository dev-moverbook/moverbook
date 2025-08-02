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

interface MoveCardProps {
  move: Doc<"move">;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  onClick?: (moveId: Id<"move">) => void;
}

const MoveOnlyCard: React.FC<MoveCardProps> = ({
  move,
  showActions = false,
  onDuplicate,
  onClick,
}) => {
  const { moveDate, moveStatus, _id } = move;
  const { slug } = useSlugContext();
  const router = useRouter();

  const tags = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    formatMoveSize(move.locations[0].moveSize),
    formatAccessType(move.locations[0].accessType),
    formatLocationType(move.locations[0].locationType),
  ].filter(Boolean) as string[];

  const [low, high] = getMoveCostRange(move);
  const price = formatPriceRange(low, high);

  return (
    <div
      onClick={() => onClick?.(move._id)}
      className="border-b border-grayCustom sm:border-none"
    >
      <div
        className={`
          bg-black py-2 px-4 text-white transition-colors duration-200
          ${onClick ? "hover:bg-background2 cursor-pointer" : ""}
        `}
      >
        <div className="max-w-screen-sm mx-auto">
          <p className="text-xs text-grayCustom2">
            {formatDateToLong(moveDate)}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-sm">
                <span style={{ color: getStatusColor(moveStatus) }}>●</span>{" "}
                <span>{moveStatus}</span>
                <span className="text-greenCustom font-medium pl-2">
                  {price}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            {tags.map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-4 mt-1 justify-between sm:justify-start">
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
