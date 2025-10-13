import React from "react";
import AssignMovers from "../move/AssignMovers";
import { useGetMoveAssignmentsPage } from "@/app/hooks/queries/useGetMoveAssignmentsPage";
import PreMove from "../move/PreMove";
import AdditionalLiabilityCoverage from "../move/AdditionalLiabilityCoverage";
import { getMoveStatus } from "@/app/frontendUtils/tsxHelper";
import StepStatus from "../shared/StepStatus";
import { useMoveContext } from "@/app/contexts/MoveContext";
import MoverScheduleCalendar from "../move/MoverScheduleCalendar";
import ViewMoverSectionAsRep from "../move/ViewMoverSectionAsRep";
import { isSameDayOrLater } from "@/app/frontendUtils/luxonUtils";
import { useSlugContext } from "@/app/contexts/SlugContext";

const MoveStep = () => {
  const { moveData } = useMoveContext();
  const { timeZone } = useSlugContext();
  const { move } = moveData;

  const result = useGetMoveAssignmentsPage(move._id);

  switch (result) {
    case undefined:
      return null;
    default:
      const {
        assignments,
        allMovers,
        preMoveDoc,
        additionalLiabilityCoverage,
      } = result;
      const moveStatus = getMoveStatus(
        move,
        assignments.length,
        preMoveDoc,
        timeZone
      );

      const showPreMove = isSameDayOrLater(move.moveDate, timeZone);
      const isScheduleOpen = assignments.length !== allMovers.length;

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
          <MoverScheduleCalendar
            allMovers={allMovers}
            defaultOpen={isScheduleOpen}
          />
          <AssignMovers assignments={assignments} allMovers={allMovers} />
          {showPreMove && <PreMove preMoveDoc={preMoveDoc} />}
          <AdditionalLiabilityCoverage
            additionalLiabilityCoverage={additionalLiabilityCoverage}
          />
          <ViewMoverSectionAsRep />
        </div>
      );
  }
};

export default MoveStep;
