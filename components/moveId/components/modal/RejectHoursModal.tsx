"use client";

import { useState } from "react";
import FieldGroup from "@/components/shared/field/FieldGroup";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import LabeledTextarea from "@/components/shared/labeled/LabeledTextarea";
import FormActions from "@/components/shared/buttons/FormActions";

interface RejectHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (managerNotes: string) => Promise<boolean>;
  isLoading: boolean;
  errorMessage?: string | null;
  setApproveAssignmentError: (error: string | null) => void;
}

const RejectHoursModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  errorMessage,
  setApproveAssignmentError,
}: RejectHoursModalProps) => {
  const [managerNotes, setManagerNotes] = useState<string>("");

  const resetState = () => {
    setManagerNotes("");
    setApproveAssignmentError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    setApproveAssignmentError(null);
    const success = await onSubmit(managerNotes);
    if (success) {
      resetState();
    }
  };

  const isDisabled = managerNotes === "" || isLoading;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Hours"
      description="Enter manager notes for the rejected hours."
    >
      <FieldGroup>
        <LabeledTextarea
          label="Notes"
          value={managerNotes}
          onChange={(e) => setManagerNotes(e.target.value)}
          placeholder="Add manager notes"
        />
        <FormActions
          onSave={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          onCancel={handleClose}
          saveLabel="Reject"
          cancelLabel="Cancel"
          disabled={isDisabled}
          isSaving={isLoading}
          error={errorMessage}
        />
      </FieldGroup>
    </ResponsiveModal>
  );
};

export default RejectHoursModal;
