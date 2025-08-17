"use client";

import React, { useEffect, useState } from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";

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
    setName(initialName);
    setNameError(null);
  }, [initialName, isOpen]);

  const handleClose = () => {
    setName("");
    setNameError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError(FrontEndErrorMessages.REFERARAL_NAME_REQUIRED);
      return;
    }

    const success = await onSubmit(name);
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

  const isDisabled = name.trim() === "";

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
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      description={description}
      children={formContent}
      heightVh={80}
    />
  );
};

export default CreateReferralModal;
