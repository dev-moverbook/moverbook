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
      return <ViewMoverSection data={result.data} />;
    }
    default:
      return null;
  }
};

export default MoverStep;
