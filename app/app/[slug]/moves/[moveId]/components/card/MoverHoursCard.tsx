// components/summary/card/MoverHoursCard.tsx
import React, { useState } from "react";
import { EnrichedMoveAssignment } from "@/types/convex-responses";
import ReusableCard from "./ReusableCard";
import FormActions from "@/app/components/shared/FormActions";
import {
  formatCurrency,
  formatHourStatus,
  formatTwoDecimals,
} from "@/app/frontendUtils/helper";
import { formatLongDateTime } from "@/app/frontendUtils/luxonUtils";
import { Id } from "@/convex/_generated/dataModel";
import EditToggleButton from "@/app/components/shared/buttons/EditToggleButton";

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
  const {
    _id,
    moverName,
    startTime,
    endTime,
    breakAmount,
    approvedHours,
    approvedPay,
    hourStatus,
    managerNotes,
  } = assignment;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const texts: [string, string | number | null][] = [
    ["Start Time", startTime ? formatLongDateTime(startTime, timeZone) : "—"],
    ["End Time", endTime ? formatLongDateTime(endTime, timeZone) : "—"],
    ["Break", formatTwoDecimals(breakAmount, "hours")],
    ["Total Hours", formatTwoDecimals(approvedHours, "hours")],
    ["Total Pay", approvedPay ? formatCurrency(approvedPay) : "—"],
    ["Status", formatHourStatus(hourStatus) ?? "—"],
  ];
  if (managerNotes) texts.push(["Manager Notes", managerNotes]);

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

  return (
    <ReusableCard
      title={moverName ?? "Mover"}
      texts={texts}
      actions={actions}
      actionsClassName="mt-2"
      titleActions={
        <EditToggleButton
          isEditing={isEditing}
          onToggle={() => setIsEditing((v) => !v)}
        />
      }
    />
  );
};

export default MoverHoursCard;
