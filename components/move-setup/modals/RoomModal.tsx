"use client";

import { useState, useEffect } from "react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { RoomFormData } from "@/types/form-types";
import { FrontEndErrorMessages } from "@/types/errors";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FieldRow from "@/components/shared/field/FieldRow";
import FormActions from "@/components/shared/buttons/FormActions";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    roomData: RoomFormData
  ) => Promise<boolean>;
  onEdit: (roomId: Id<"rooms">, roomData: RoomFormData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: Doc<"rooms"> | null;
}

const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  initialData,
}) => {
  const [formData, setFormData] = useState<RoomFormData>({ name: "" });
  const [fieldError, setFieldError] = useState<{ name?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name });
    } else {
      setFormData({ name: "" });
    }
    setFieldError({});
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFieldError({ name: FrontEndErrorMessages.ROOM_NAME_EMPTY });
      return;
    }

    const success = initialData
      ? await onEdit(initialData._id, formData)
      : await onCreate(companyId, formData);

    if (success) {
      onClose();
    }
  };

  const isFormIncomplete = formData.name.trim() === "";

  const hasNoChanges = initialData
    ? formData.name.trim() === initialData.name.trim()
    : false;

  const isDisabled =
    (isFormIncomplete || (initialData && hasNoChanges)) ?? false;

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Room Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter room name"
        error={fieldError.name}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={onClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Room"}
        cancelLabel="Cancel"
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Room" : "Add Room";
  const description = initialData
    ? "Edit the name of the room you want to update."
    : "Enter a name for the room you want to add.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      heightVh={80}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default RoomModal;
