// components/summary/MoveSummaryContent.tsx
import SectionHeader from "@/components/shared/SectionHeader";
import { Id } from "@/convex/_generated/dataModel";
import { EnrichedMoveAssignment } from "@/types/convex-responses";
import React, { useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { useSlugContext } from "@/contexts/SlugContext";
import MoverHoursCard from "../card/MoverHoursCard";
import MoveBalanceTable from "../table/MoveBalanceTable";
import RejectHoursModal from "../modal/RejectHoursModal";

interface MoveSummaryContentProps {
  assignments: EnrichedMoveAssignment[];
  handleApproveHours: (assignmentId: Id<"moveAssignments">) => Promise<boolean>;
  handleRejectHours: (
    assignmentId: Id<"moveAssignments">,
    notes: string
  ) => Promise<boolean>;
  approveAssignmentLoading: boolean;
  approveAssignmentError: string | null;
  setApproveAssignmentError: (error: string | null) => void;
}

const MoveSummaryContent = ({
  assignments,
  handleApproveHours,
  handleRejectHours,
  approveAssignmentLoading,
  approveAssignmentError,
  setApproveAssignmentError,
}: MoveSummaryContentProps) => {
  const { timeZone } = useSlugContext();
  const [rejectingAssignmentId, setRejectingAssignmentId] =
    useState<Id<"moveAssignments"> | null>(null);

  const openRejectModal = (assignmentId: Id<"moveAssignments">) => {
    setRejectingAssignmentId(assignmentId);
  };

  const closeRejectModal = () => {
    setRejectingAssignmentId(null);
  };

  const handleRejectSubmit = async (managerNotes: string) => {
    if (!rejectingAssignmentId) {
      return false;
    }
    const success = await handleRejectHours(
      rejectingAssignmentId,
      managerNotes
    );
    if (success) {
      closeRejectModal();
    }
    return success;
  };

  return (
    <div className="pb-20">
      <SectionHeader title="Mover Hours" className="pb-0 mx-auto" />
      <SectionContainer showBorder={false} className="space-y-4 ">
        {assignments.map((assignment) => (
          <MoverHoursCard
            key={assignment._id}
            assignment={assignment}
            timeZone={timeZone}
            isSaving={approveAssignmentLoading}
            errorMessage={approveAssignmentError}
            onApprove={(id) => handleApproveHours(id)}
            onReject={(id) => openRejectModal(id)}
          />
        ))}
        <MoveBalanceTable assignments={assignments} />
      </SectionContainer>

      <RejectHoursModal
        isOpen={Boolean(rejectingAssignmentId)}
        onClose={closeRejectModal}
        onSubmit={handleRejectSubmit}
        isLoading={approveAssignmentLoading}
        errorMessage={approveAssignmentError}
        setApproveAssignmentError={setApproveAssignmentError}
      />
    </div>
  );
};

export default MoveSummaryContent;
