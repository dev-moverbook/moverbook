import React from "react";
import MoveCard from "./MoveCard";
import { EnrichedMove } from "@/types/convex-responses";
import PayOutSummary from "@/app/app/[slug]/calendar/components/PayOutSummary";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { isMover } from "@/app/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";

interface MoveCardContainerProps {
  moves: EnrichedMove[];
  isfilterDates: boolean;
}

const MoveCardContainer: React.FC<MoveCardContainerProps> = ({
  moves,
  isfilterDates,
}) => {
  const { user } = useSlugContext();
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);

  const emptyMessage = isfilterDates
    ? "No moves for custom date range."
    : "No moves this week.";
  return (
    <div className="mt-2">
      {moves.length === 0 ? (
        <p className=" pl-4 md:pl-0 text-grayCustom2">{emptyMessage}</p>
      ) : (
        <div className="">
          {moves.map((move) => (
            <MoveCard
              key={move._id}
              move={move}
              moveCustomer={move.moveCustomer}
              salesRep={move.salesRepUser}
            />
          ))}
        </div>
      )}
      {isMoverUser && <PayOutSummary />}
    </div>
  );
};

export default MoveCardContainer;
