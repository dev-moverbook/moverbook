"use client";

import React, { useState } from "react";
import { RoomFormData } from "@/types/form-types";
import FieldGroup from "@/components/shared/FieldGroup";
import FieldRow from "@/components/shared/FieldRow";
import FormActions from "@/components/shared/FormActions";
import {
  RoomValidationErrors,
  validateRoomForm,
} from "@/frontendUtils/validation";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";

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

  const isDisabled = formData.name.trim() === "";

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
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  const title = "Add Room";
  const description = "Enter a name for the room.";

  return (
    <ResponsiveModal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={handleClose}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default AddRoomModal;
