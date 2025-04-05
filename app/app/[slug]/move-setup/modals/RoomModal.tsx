"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Id } from "@/convex/_generated/dataModel";
import { RoomSchema } from "@/types/convex-schemas";
import { RoomFormData } from "@/types/form-types";
import { FrontEndErrorMessages } from "@/types/errors";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";

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
  initialData?: RoomSchema | null;
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
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
        onSave={handleSubmit}
        onCancel={onClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Room"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Room" : "Add Room";

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{title}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;
