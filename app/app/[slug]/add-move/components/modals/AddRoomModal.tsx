"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { RoomFormData } from "@/types/form-types";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import { MOBILE_BREAKPOINT } from "@/types/const";
import {
  RoomValidationErrors,
  validateRoomForm,
} from "@/app/frontendUtils/validation";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatedRoom: (name: string) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onCreatedRoom,
}) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
  const [formData, setFormData] = useState<RoomFormData>({ name: "" });
  const [errors, setErrors] = useState<RoomValidationErrors>({});

  const resetFormData = () => {
    setFormData({ name: "" });
    setErrors({});
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateRoomForm(formData);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    onCreatedRoom(formData.name);
    handleClose();
  };

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Room Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter room name"
        error={errors.name}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        saveLabel={"Add Room"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  const title = "Add Room";

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{title}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomModal;
