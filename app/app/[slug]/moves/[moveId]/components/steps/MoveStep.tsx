import React from "react";
import AssignMovers from "../move/AssignMovers";
import { useGetMoveAssignmentsPage } from "@/app/hooks/queries/useGetMoveAssignmentsPage";
import PreMove from "../move/PreMove";
import FullLoading from "@/app/components/shared/FullLoading";
import { Doc } from "@/convex/_generated/dataModel";
import AdditionalLiabilityCoverage from "../move/AdditionalLiabilityCoverage";
import { getMoveStatus } from "@/app/frontendUtils/tsxHelper";
import StepStatus from "../shared/StepStatus";

interface MoveStepProps {
  move: Doc<"move">;
  quote: Doc<"quotes"> | null;
}

const MoveStep = ({ move, quote }: MoveStepProps) => {
  const { data, isLoading, isError, errorMessage } = useGetMoveAssignmentsPage(
    move._id
  );

  const { assignments, allMovers, preMoveDoc, additionalLiabilityCoverage } =
    data ?? {
      assignments: [],
      allMovers: [],
      preMoveDoc: null,
      additionalLiabilityCoverage: null,
    };
  const moveStatus = getMoveStatus(move, assignments.length, preMoveDoc);

  if (isLoading) {
    return <FullLoading />;
  }
  return (
    <div>
      <StepStatus
        items={[
          {
            label: "Move Status",
            value: moveStatus.label,
            icon: moveStatus.icon,
          },
        ]}
      />
      <AssignMovers
        assignments={assignments}
        allMovers={allMovers}
        move={move}
      />
      <PreMove preMoveDoc={preMoveDoc} moveId={move._id} />
      <AdditionalLiabilityCoverage
        additionalLiabilityCoverage={additionalLiabilityCoverage}
        moveId={move._id}
      />
    </div>
  );
};

export default MoveStep;
