import React from "react";
import MoveCard from "./MoveCard";
import { EnrichedMove } from "@/types/convex-responses";

interface MoveCardContainerProps {
  moves: EnrichedMove[];
  isfilterDates: boolean;
}

const MoveCardContainer: React.FC<MoveCardContainerProps> = ({
  moves,
  isfilterDates,
}) => {
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
    </div>
  );
};

export default MoveCardContainer;
