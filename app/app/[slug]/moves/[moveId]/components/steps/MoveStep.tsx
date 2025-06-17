import MoveHeading from "@/app/app/[slug]/moves/[moveId]/components/move/MoveHeading";
import { getMoveStatus } from "@/app/frontendUtils/helper";
import { QuoteSchema } from "@/types/convex-schemas";
import { MoveSchema } from "@/types/convex-schemas";
import React from "react";
import AssignMovers from "../move/AssignMovers";
import { useGetMoveAssignmentsPage } from "@/app/hooks/queries/useGetMoveAssignmentsPage";
import PreMove from "../move/PreMove";
import FullLoading from "@/app/components/shared/FullLoading";
interface MoveStepProps {
  move: MoveSchema;
  quote: QuoteSchema | null;
}

const MoveStep = ({ move, quote }: MoveStepProps) => {
  const { data, isLoading, isError, errorMessage } = useGetMoveAssignmentsPage(
    move._id
  );

  const { assignments, allMovers, preMoveDoc } = data ?? {
    assignments: [],
    allMovers: [],
    preMoveDoc: null,
  };
  const moveStatus = getMoveStatus(move, quote, assignments.length, preMoveDoc);

  if (isLoading) {
    return <FullLoading />;
  }
  return (
    <div>
      <MoveHeading moveStatus={moveStatus} />
      <AssignMovers
        assignments={assignments}
        allMovers={allMovers}
        move={move}
      />
      <PreMove preMoveDoc={preMoveDoc} moveId={move._id} />
    </div>
  );
};

export default MoveStep;
