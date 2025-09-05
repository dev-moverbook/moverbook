// components/summary/card/MoverHoursCard.tsx
import React, { useState } from "react";
import { EnrichedMoveAssignment } from "@/types/convex-responses";
import ReusableCard from "./ReusableCard";
import FormActions from "@/app/components/shared/FormActions";
import { Id } from "@/convex/_generated/dataModel";
import EditToggleButton from "@/app/components/shared/buttons/EditToggleButton";
import { buildMoverHoursTexts } from "@/app/frontendUtils/moveHelper";

interface MoverHoursCardProps {
  assignment: EnrichedMoveAssignment;
  onApprove?: (assignmentId: Id<"moveAssignments">) => Promise<boolean>;
  onReject?: (assignmentId: Id<"moveAssignments">) => void;
  isSaving?: boolean;
  errorMessage?: string | null;
  timeZone: string;
}

const MoverHoursCard = ({
  assignment,
  onApprove,
  onReject,
  isSaving = false,
  errorMessage = null,
  timeZone,
}: MoverHoursCardProps) => {
  const { _id, moverName, hourStatus } = assignment;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const texts = buildMoverHoursTexts(assignment, timeZone);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onApprove?.(_id);
    if (success) setIsEditing(false);
  };

  const handleReject = () => {
    onReject?.(_id);
    setIsEditing(false);
  };

  const actions =
    hourStatus === "pending" || isEditing ? (
      <FormActions
        onSave={(e) => void handleApprove(e)}
        onCancel={handleReject}
        isSaving={isSaving}
        error={errorMessage}
        saveLabel="Approve"
        cancelLabel="Reject"
      />
    ) : null;

  const showEditToggle = hourStatus === "approved" || hourStatus === "rejected";

  return (
    <ReusableCard
      title={moverName ?? "Mover"}
      texts={texts}
      actions={actions}
      actionsClassName="mt-2"
      titleActions={
        showEditToggle && (
          <EditToggleButton
            isEditing={isEditing}
            onToggle={() => setIsEditing((v) => !v)}
          />
        )
      }
    />
  );
};

export default MoverHoursCard;
