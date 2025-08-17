"use client";

import React, { useState } from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";

interface CreateVariableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, defaultValue: string) => Promise<boolean>;
  createLoading: boolean;
  createError: string | null;
}

const CreateVariableModal: React.FC<CreateVariableModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  createLoading,
  createError,
}) => {
  const [name, setName] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [defaultValueError, setDefaultValueError] = useState<string | null>(
    null
  );

  const resetState = () => {
    setName("");
    setDefaultValue("");
    setNameError(null);
    setDefaultValueError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCreate = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError(FrontEndErrorMessages.VARIABLE_NAME_REQUIRED);
      hasError = true;
    }

    if (!defaultValue.trim()) {
      setDefaultValueError(FrontEndErrorMessages.VARIABLE_DEFAULT_REQUIRED);
      hasError = true;
    }

    if (hasError) return;

    const success = await onCreate(name, defaultValue);
    if (success) {
      handleClose();
    }
  };

  const formContent = (
    <FieldGroup>
      <LabeledInput
        label="Variable Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNameError(null);
        }}
        placeholder="Enter variable name"
        error={nameError}
      />

      <LabeledInput
        label="Default Value"
        value={defaultValue}
        onChange={(e) => {
          setDefaultValue(e.target.value);
          setDefaultValueError(null);
        }}
        placeholder="Enter default value"
        error={defaultValueError}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        onCancel={handleClose}
        isSaving={createLoading}
        saveLabel="Create Variable"
        error={createError}
      />
    </FieldGroup>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Variable"
      description="Define a variable and its default value"
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default CreateVariableModal;
