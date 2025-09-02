import React from "react";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { QueryStatus } from "@/types/enums";
import { useMoveAssignments } from "@/app/hooks/queries/moveAssignments/useMoveAssignments";
import ViewSummary from "../section/ViewSummary";

const SummaryTab = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const result = useMoveAssignments(move._id);

  switch (result.status) {
    case QueryStatus.LOADING:
      return null;
    case QueryStatus.ERROR:
      return <ErrorComponent message={result.errorMessage} />;
    case QueryStatus.SUCCESS: {
      const { assignments } = result.data;

      return <ViewSummary assignments={assignments} />;
    }
    default:
      return null;
  }
};

export default SummaryTab;
