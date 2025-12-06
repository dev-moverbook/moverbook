"use client";

import { useEffect, useState, useMemo } from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import FormActions from "@/components/shared/buttons/FormActions";
import FieldGroup from "@/components/shared/field/FieldGroup";
import LabeledInput from "@/components/shared/labeled/LabeledInput";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  initialName?: string;
  mode?: "create" | "edit";
}

const CreateReferralModal: React.FC<CreateReferralModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  initialName = "",
  mode = "create",
}) => {
  const [name, setName] = useState<string>(initialName);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setNameError(null);
    }
  }, [initialName, isOpen]);

  const handleClose = () => {
    setName("");
    setNameError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(FrontEndErrorMessages.REFERARAL_NAME_REQUIRED);
      return;
    }

    const success = await onSubmit(trimmedName);
    if (success) {
      handleClose();
    }
  };

  const isEditMode = mode === "edit";
  const modalTitle = isEditMode ? "Edit Referral" : "Create Referral";
  const description = isEditMode
    ? "Update this referral name."
    : "Enter the name of the referral you want to add.";
  const saveLabel = isEditMode
    ? loading
      ? "Saving..."
      : "Save Changes"
    : loading
      ? "Creating..."
      : "Create Referral";

  const hasChanges = useMemo(() => {
    const trimmedCurrent = name.trim();
    const trimmedInitial = initialName.trim();
    return trimmedCurrent !== trimmedInitial;
  }, [name, initialName]);

  const isEmpty = name.trim() === "";
  const canSave = !isEmpty && (mode === "create" || hasChanges);

  const formContent = (
    <FieldGroup>
      <LabeledInput
        label="Referral Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNameError(null);
        }}
        placeholder="Enter referral name"
        error={nameError}
      />

      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        isSaving={loading}
        saveLabel={saveLabel}
        error={error}
        disabled={!canSave}
      />
    </FieldGroup>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      description={description}
      heightVh={80}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default CreateReferralModal;
