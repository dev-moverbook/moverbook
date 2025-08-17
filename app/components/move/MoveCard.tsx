"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CopyPlus, Eye } from "lucide-react";
import {
  formatDateToLong,
  formatLocationType,
  formatPriceRange,
  getMoveCostRange,
  getStatusColor,
  getInitials,
} from "@/app/frontendUtils/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";

interface MoveCardProps {
  move: Doc<"move">;
  moveCustomer: Doc<"moveCustomers"> | null;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  salesRep: Doc<"users"> | null;
}

const MoveCard: React.FC<MoveCardProps> = ({
  move,
  moveCustomer,
  showActions = false,
  onDuplicate,
  salesRep,
}) => {
  const { moveDate, moveStatus, _id } = move;
  const name = moveCustomer?.name;
  const { slug } = useSlugContext();
  const router = useRouter();

  const tags = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    formatLocationType(move.locations[0].locationType),
  ].filter(Boolean) as string[];

  const [low, high] = getMoveCostRange(move);
  const price = formatPriceRange(low, high);

  const repInitials = getInitials(salesRep?.name || "Rep");

  const content = (
    <div
      className={`py-4 px-4 text-white shadow-md border-b  border-grayCustom ${
        !showActions
          ? "hover:bg-background2 transition-colors duration-200"
          : ""
      }`}
    >
      <div className="max-w-screen-sm mx-auto">
        {/* Main row */}
        <div className="flex items-stretch justify-between gap-4">
          {/* Left: date + name + status/price */}
          <div className="flex flex-col min-w-0">
            <p className="text-grayCustom2">{formatDateToLong(moveDate)}</p>
            <h3 className="text-lg font-medium truncate">
              {name ?? "No name"}
            </h3>
            <div className="flex items-center gap-2 min-w-0">
              <span style={{ color: getStatusColor(moveStatus) }}>●</span>
              <span className="truncate">{moveStatus}</span>
              <span className="text-greenCustom font-medium pl-2">{price}</span>
            </div>
          </div>

          {/* Right: sales rep — bottom aligned */}
          <div className="flex flex-col items-center self-stretch">
            <div className="mt-auto flex flex-col items-center">
              <div className="w-10 h-10 border border-grayCustom rounded-full overflow-hidden flex items-center justify-center bg-background2">
                {salesRep?.imageUrl ? (
                  <img
                    src={salesRep.imageUrl}
                    alt={salesRep?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-white font-medium">
                    {repInitials}
                  </span>
                )}
              </div>
              <span className="text-sm text-grayCustom2  text-center max-w-[9rem] truncate">
                {salesRep?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 flex-wrap mt-1">
          {tags.map((tag, i) => (
            <Badge key={i}>{tag}</Badge>
          ))}
        </div>

        {showActions && (
          <div className="flex gap-4 mt-2 justify-between sm:justify-start">
            <Button
              size="auto"
              variant="link"
              onClick={() =>
                router.push(`/app/${slug}/customer/${moveCustomer?._id}`)
              }
            >
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>View Customer</span>
              </div>
            </Button>
            <Button
              size="auto"
              variant="link"
              onClick={() => onDuplicate?.(move)}
            >
              <div className="flex items-center gap-1">
                <CopyPlus className="w-4 h-4" />
                <span>Duplicate Move</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return showActions ? (
    content
  ) : (
    <Link href={`/app/${slug}/moves/${_id}`}>{content}</Link>
  );
};

export default MoveCard;
