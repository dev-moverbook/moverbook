"use client";

import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FrontEndErrorMessages } from "@/types/errors";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledInput from "@/app/components/shared/LabeledInput";

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
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
  const saveLabel = isEditMode
    ? loading
      ? "Saving..."
      : "Save Changes"
    : loading
      ? "Creating..."
      : "Create Referral";

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
        onSave={handleSubmit}
        onCancel={handleClose}
        isSaving={loading}
        saveLabel={saveLabel}
        error={error}
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{modalTitle}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogDescription>
          {isEditMode ? "Update this referral name." : "Add a new referral."}
        </DialogDescription>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default CreateReferralModal;
