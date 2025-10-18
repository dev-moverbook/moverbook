"use client";

import ResponsiveModal from "./ResponsiveModal";
import FormActions from "../buttons/FormActions";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteLoading: boolean;
  deleteError: string | null;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deleteLoading,
  deleteError,
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this action?",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  const content = (
    <div className="space-y-4 ">
      <FormActions
        onSave={onConfirm}
        onCancel={onClose}
        saveVariant="destructive"
        saveLabel={confirmButtonText}
        cancelLabel={cancelButtonText}
        isSaving={deleteLoading}
        error={deleteError}
        cancelVariant="whiteGhost"
      />
    </div>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      {content}
    </ResponsiveModal>
  );
};

export default ConfirmModal;
