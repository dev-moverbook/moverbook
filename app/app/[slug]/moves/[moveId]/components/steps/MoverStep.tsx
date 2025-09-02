import React from "react";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { QueryStatus } from "@/types/enums";
import { useMovePageForMover } from "@/app/hooks/queries/movers/useMovePageForMover";
import ViewMoverSection from "../section/ViewMoverSection";

const MoverStep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const result = useMovePageForMover(move._id);

  switch (result.status) {
    case QueryStatus.LOADING:
      return null;
    case QueryStatus.ERROR:
      return <ErrorComponent message={result.errorMessage} />;
    case QueryStatus.SUCCESS: {
      const isLead = result.data.isLead;

      if (isLead) {
        return (
          <ViewMoverSection
            preMoveDoc={result.data.preMoveDoc}
            discounts={result.data.discounts}
            additionalFees={result.data.additionalFees}
            invoice={result.data.invoice}
            additionalLiabilityCoverage={
              result.data.additionalLiabilityCoverage
            }
            fees={result.data.fees}
            assignment={result.data.assignment}
          />
        );
      } else {
        return null;
      }
    }
    default:
      return null;
  }
};

export default MoverStep;
