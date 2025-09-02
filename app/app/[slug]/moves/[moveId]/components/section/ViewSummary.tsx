// components/summary/ViewSummary.tsx
"use client";

import { EnrichedMoveAssignment } from "@/types/convex-responses";
import { Id } from "@/convex/_generated/dataModel";
import MoveSummaryContent from "./MoveSummaryContent";
import { useApproveMoveAssignmentHours } from "../../../hooks/useApproveMoveAssignmentHours";

interface ViewSummaryProps {
  assignments: EnrichedMoveAssignment[];
}

const ViewSummary = ({ assignments }: ViewSummaryProps) => {
  const {
    approveMoveAssignmentHours,
    approveAssignmentLoading,
    approveAssignmentError,
    setApproveAssignmentError,
  } = useApproveMoveAssignmentHours();

  const handleApproveHours = async (
    assignmentId: Id<"moveAssignments">
  ): Promise<boolean> => {
    const { success } = await approveMoveAssignmentHours({
      assignmentId,
      updates: { hourStatus: "approved", managerNotes: "" },
    });
    return success;
  };

  const handleRejectHours = async (
    assignmentId: Id<"moveAssignments">,
    notes: string
  ): Promise<boolean> => {
    const { success } = await approveMoveAssignmentHours({
      assignmentId,
      updates: { hourStatus: "rejected", managerNotes: notes },
    });
    return success;
  };

  return (
    <MoveSummaryContent
      assignments={assignments}
      handleApproveHours={handleApproveHours}
      handleRejectHours={handleRejectHours}
      approveAssignmentLoading={approveAssignmentLoading}
      approveAssignmentError={approveAssignmentError}
      setApproveAssignmentError={setApproveAssignmentError}
    />
  );
};

export default ViewSummary;
