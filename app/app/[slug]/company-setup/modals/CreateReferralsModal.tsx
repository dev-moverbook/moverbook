"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FrontEndErrorMessages } from "@/types/errors";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledInput from "@/app/components/shared/LabeledInput";

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<boolean>;
  createLoading: boolean;
  createError: string | null;
}

const CreateReferralModal: React.FC<CreateReferralModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  createLoading,
  createError,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);

  const resetState = () => {
    setName("");
    setNameError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setNameError(FrontEndErrorMessages.REFERARAL_NAME_REQUIRED);
      return;
    }

    const success = await onCreate(name);
    if (success) {
      handleClose();
    }
  };

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
        onSave={handleCreate}
        onCancel={handleClose}
        isSaving={createLoading}
        saveLabel={createLoading ? "Creating..." : "Create Referral"}
        error={createError}
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>Create Referral</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Create Referral</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default CreateReferralModal;
