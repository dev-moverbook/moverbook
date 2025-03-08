"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FrontEndErrorMessages } from "@/types/errors";
import { Button } from "@/app/components/ui/button";

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
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <Label className="block text-sm font-medium">Referral Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(null);
          }}
          placeholder="Enter referral name"
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleCreate}
        disabled={createLoading}
        className="w-full"
      >
        {createLoading ? "Creating..." : "Create Referral"}
      </Button>

      {createError && <p className="text-red-500 text-sm">{createError}</p>}
    </div>
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
