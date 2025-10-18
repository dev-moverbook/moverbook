"use client";

import { useMoveContext } from "@/contexts/MoveContext";
import MoverSection from "@/components/move/movers/MoverSection";
import { useUpdateMoveAssignmentHours } from "@/hooks/moveAssignments";
import { useSlugContext } from "@/contexts/SlugContext";

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

  const updateHours = async (updates: {
    startTime?: number;
    endTime?: number;
    breakAmount?: number;
  }) => {
    await updateMoveAssignmentHours({
      assignmentId: assignment._id,
      updates,
    });
  };

  return (
    <MoverSection
      isSaving={assignmentUpdateLoading}
      updateError={assignmentUpdateError}
      updateHours={updateHours}
      assignment={assignment}
      timeZone={timeZone}
      breakHours={assignment.breakAmount || 0}
      wageDisplay={wageDisplay}
    />
  );
};

export default ShiftStep;
