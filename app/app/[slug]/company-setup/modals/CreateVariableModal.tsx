"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FrontEndErrorMessages } from "@/types/errors";
import { Button } from "@/app/components/ui/button";

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
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <Label className="block text-sm font-medium">Variable Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(null);
          }}
          placeholder="Enter variable name"
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
      </div>

      {/* Default Value Input */}
      <div>
        <Label className="block text-sm font-medium">Default Value</Label>
        <Input
          type="text"
          value={defaultValue}
          onChange={(e) => {
            setDefaultValue(e.target.value);
            setDefaultValueError(null);
          }}
          placeholder="Enter default value"
        />
        {defaultValueError && (
          <p className="text-red-500 text-sm">{defaultValueError}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleCreate}
        disabled={createLoading}
        className="w-full"
      >
        {createLoading ? "Creating..." : "Create Variable"}
      </Button>

      {createError && <p className="text-red-500 text-sm">{createError}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>Create Variable</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Create Variable</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default CreateVariableModal;
