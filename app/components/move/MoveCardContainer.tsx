import React from "react";
import MoveCard from "./MoveCard";
import { EnrichedMove } from "@/types/convex-responses";

interface MoveCardContainerProps {
  moves: EnrichedMove[];
}

const MoveCardContainer: React.FC<MoveCardContainerProps> = ({ moves }) => {
  return (
    <div className="mt-2">
      {moves.length === 0 ? (
        <p className="text-sm p-4 text-grayCustom2">No moves this week.</p>
      ) : (
        <div className="border-t border-grayCustom mt-2">
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
