import React from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { useMoveAssignments } from "@/app/hooks/queries/moveAssignments/useMoveAssignments";
import ViewSummary from "../section/ViewSummary";

const SummaryTab = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const result = useMoveAssignments(move._id);

  switch (result) {
    case undefined:
      return null;
    default: {
      return <ViewSummary assignments={result} />;
    }
  }
};

export default SummaryTab;
