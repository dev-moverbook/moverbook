"use client";

import { useGetMoveAssignmentsPage } from "@/hooks/moveAssignments";
import { useMoveContext } from "@/contexts/MoveContext";
import { useSlugContext } from "@/contexts/SlugContext";
import { getSetUpStatus } from "@/frontendUtils/tsxHelper";
import { isSameDayOrLater } from "@/frontendUtils/luxonUtils";
import AssignMovers from "../move/AssignMovers";
import Waiver from "../move/Waiver";
import StepStatus from "../shared/StepStatus";
import MoverScheduleCalendar from "../move/MoverScheduleCalendar";
import Contract from "../move/Contract";

const SetUpStep = () => {
  const { moveData } = useMoveContext();
  const { timeZone } = useSlugContext();
  const { move } = moveData;

  const result = useGetMoveAssignmentsPage(move._id);

  switch (result) {
    case undefined:
      return null;
    default:
      const { assignments, allMovers, contract, waiver } = result;
      const setUpStatus = getSetUpStatus(
        move,
        assignments.length,
        contract,
        timeZone
      );

      const showPreMove = isSameDayOrLater(move.moveDate, timeZone);
      const isScheduleOpen = assignments.length !== allMovers.length;

      return (
        <div>
          <StepStatus
            items={[
              {
                label: "Setup Status",
                value: setUpStatus.label,
                icon: setUpStatus.icon,
              },
            ]}
          />
          <MoverScheduleCalendar
            allMovers={allMovers}
            defaultOpen={isScheduleOpen}
          />
          <AssignMovers assignments={assignments} allMovers={allMovers} />
          {showPreMove && <Contract contract={contract} />}
          <Waiver waiver={waiver} />
        </div>
      );
  }
};

export default SetUpStep;
