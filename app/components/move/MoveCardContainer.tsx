import React from "react";
import MoveCard from "./MoveCard";
import { EnrichedMove } from "@/types/convex-responses";
import PayOutSummary from "@/app/app/[slug]/calendar/components/PayOutSummary";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { isMover } from "@/app/frontendUtils/permissions";
import { ClerkRoles } from "@/types/enums";
import { useMoveFilter } from "@/app/contexts/MoveFilterContext";

interface MoveCardContainerProps {
  moves: EnrichedMove[];
  isfilterDates: boolean;
  weekStart: string;
  weekEnd: string;
}

const MoveCardContainer: React.FC<MoveCardContainerProps> = ({
  moves,
  isfilterDates,
  weekStart,
  weekEnd,
}) => {
  const { user, slug } = useSlugContext();
  const { selectedStatuses } = useMoveFilter();
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);
  const isCompleted = selectedStatuses.includes("Completed");
  const showPayoutSummary = isMoverUser && isCompleted;

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
              estimatedWage={move.estimatedWage}
              hourStatus={move.hourStatus}
              isMover={isMoverUser}
              slug={slug ?? ""}
            />
          ))}
        </div>
      )}
      {showPayoutSummary && (
        <PayOutSummary moves={moves} weekStart={weekStart} weekEnd={weekEnd} />
      )}
    </div>
  );
};

export default MoveCardContainer;
