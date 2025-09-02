import React from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import MoverSection from "@/app/components/move/movers/MoverSection";
import { useUpdateMoveAssignmentHours } from "../../../hooks/useUpdateMoveAssignmentHours";
import { useSlugContext } from "@/app/contexts/SlugContext";

const ShiftStep = () => {
  const { moveData } = useMoveContext();
  const { myAssignment: assignment } = moveData;
  const { timeZone } = useSlugContext();
  const { wageDisplay } = moveData;

  const {
    updateMoveAssignmentHours,
    assignmentUpdateLoading,
    assignmentUpdateError,
  } = useUpdateMoveAssignmentHours();

  if (!assignment) {
    return null;
  }

  const handleStartTimeChange = async (startTime: number) => {
    await updateMoveAssignmentHours({
      assignmentId: assignment._id,
      updates: { startTime },
    });
  };

  const handleEndTimeChange = async (endTime: number) => {
    await updateMoveAssignmentHours({
      assignmentId: assignment._id,
      updates: { endTime },
    });
  };

  const handleChangeBreakTime = async (breakTime: number) => {
    await updateMoveAssignmentHours({
      assignmentId: assignment._id,
      updates: { breakAmount: breakTime },
    });
  };

  return (
    <MoverSection
      isSaving={assignmentUpdateLoading}
      updateError={assignmentUpdateError}
      handleStartTimeChange={handleStartTimeChange}
      handleEndTimeChange={handleEndTimeChange}
      assignment={assignment}
      timeZone={timeZone}
      breakHours={assignment.breakAmount || 0}
      handleChangeBreakTime={handleChangeBreakTime}
      wageDisplay={wageDisplay}
    />
  );
};

export default ShiftStep;
