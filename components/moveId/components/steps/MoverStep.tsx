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
            preMoveDoc={result.preMoveDoc}
            discounts={result.discounts}
            additionalFees={result.additionalFees}
            invoice={result.invoice}
            additionalLiabilityCoverage={result.additionalLiabilityCoverage}
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
