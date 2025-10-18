import React from "react";
import { useMoveContext } from "@/contexts/MoveContext";
import { useMoveAssignments } from "@/hooks/moveAssignments";
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
