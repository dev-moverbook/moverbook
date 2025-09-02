import React from "react";
import AssignMovers from "../move/AssignMovers";
import { useGetMoveAssignmentsPage } from "@/app/hooks/queries/useGetMoveAssignmentsPage";
import PreMove from "../move/PreMove";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import AdditionalLiabilityCoverage from "../move/AdditionalLiabilityCoverage";
import { getMoveStatus } from "@/app/frontendUtils/tsxHelper";
import StepStatus from "../shared/StepStatus";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { QueryStatus } from "@/types/enums";
import MoverScheduleCalendar from "../move/MoverScheduleCalendar";
import ViewMoverSectionAsRep from "../move/ViewMoverSectionAsRep";

const MoveStep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const result = useGetMoveAssignmentsPage(move._id);

  switch (result.status) {
    case QueryStatus.LOADING:
      return null;
    case QueryStatus.ERROR:
      return <ErrorComponent message={result.errorMessage} />;
    case QueryStatus.SUCCESS: {
      const {
        assignments,
        allMovers,
        preMoveDoc,
        additionalLiabilityCoverage,
      } = result.data;
      const moveStatus = getMoveStatus(move, assignments.length, preMoveDoc);

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
          <MoverScheduleCalendar allMovers={allMovers} />
          <AssignMovers assignments={assignments} allMovers={allMovers} />
          <PreMove preMoveDoc={preMoveDoc} />
          <AdditionalLiabilityCoverage
            additionalLiabilityCoverage={additionalLiabilityCoverage}
          />
          <ViewMoverSectionAsRep />
        </div>
      );
    }
    default:
      return null;
  }
};

export default MoveStep;
