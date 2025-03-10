"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { RoomSchema } from "@/types/convex-schemas";
import { RoomFormData } from "@/types/form-types";
import { FrontEndErrorMessages } from "@/types/errors";

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
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name });
    } else {
      setFormData({ name: "" });
    }
    setValidationError(null);
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
    setValidationError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setValidationError(FrontEndErrorMessages.ROOM_NAME_EMPTY);
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
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Room Name</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter room name"
        />
        {validationError && (
          <p className="text-red-500 text-sm mt-1">{validationError}</p>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Saving..." : initialData ? "Save Changes" : "Add Room"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{initialData ? "Edit Room" : "Add Room"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{initialData ? "Edit Room" : "Add Room"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default RoomModal;
