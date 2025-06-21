import React from "react";
import { MoveSchema } from "@/types/convex-schemas"; // adjust if needed
import MoveCard from "./MoveCard"; // adjust path

interface MoveCardContainerProps {
  moves: MoveSchema[];
}

const MoveCardContainer: React.FC<MoveCardContainerProps> = ({ moves }) => {
  return (
    <div className=" border-t border-grayCustom mt-2">
      {moves.length === 0 ? (
        <p className="text-sm p-4 text-grayCustom2">No moves this week.</p>
      ) : (
        moves.map((move) => <MoveCard key={move._id} move={move} />)
      )}
    </div>
  );
};

export default MoveCardContainer;
