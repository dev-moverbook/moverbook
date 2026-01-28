"use client";

import { Badge } from "@/components/ui/badge";
import { formatDateToLong } from "@/frontendUtils/helper";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { getMoveTags, getPublicStatusDisplay } from "@/frontendUtils/tsxHelper";

const PublicMoveCard: React.FC = () => {
  const { move: moveData } = usePublicMoveIdContext();
  const {
    move,
    moveCustomer,
    quote,
    contract,
    waiver,
    invoice,
    changeRequests,
  } = moveData;

  const name = moveCustomer.name ?? "Move Details";

  const tags = getMoveTags(move);

  const publicStatusDisplay = getPublicStatusDisplay({
    quote,
    contract,
    waiver,
    move,
    invoice,
    changeRequests,
  });

  return (
    <div
      className={`
        py-4 px-4 text-white shadow-md rounded-lg bg-black 
      `}
    >
      <div className="max-w-screen-sm mx-auto">
        <div className="flex flex-col min-w-0">
          <p className="text-grayCustom2 text-sm">
            {formatDateToLong(move.moveDate ?? null)}
          </p>
          <h3 className="text-lg font-medium truncate">{name}</h3>

          {publicStatusDisplay && (
            <div className="flex items-center gap-2 text-sm ">
              <span style={{ color: publicStatusDisplay.color }}>●</span>
              <span className="truncate">{publicStatusDisplay.label}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap  mt-1">
          {tags.map((tag, i) => (
            <Badge key={i} interactive={false} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicMoveCard;
