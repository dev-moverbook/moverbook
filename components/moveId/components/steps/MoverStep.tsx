"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import { useMovePageForMover } from "@/hooks/movers/useMovePageForMover";
import ViewMoverSection from "../section/ViewMoverSection";

const MoverStep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const result = useMovePageForMover(move._id);

  switch (result) {
    case undefined:
      return null;
    default:
      const isLead = result.isLead;

      if (isLead) {
        return (
          <ViewMoverSection
            contract={result.contract}
            discounts={result.discounts}
            additionalFees={result.additionalFees}
            waiver={result.waiver}
            fees={result.fees}
            assignment={result.assignment}
          />
        );
      } else {
        return null;
      }
  }
};

export default MoverStep;
