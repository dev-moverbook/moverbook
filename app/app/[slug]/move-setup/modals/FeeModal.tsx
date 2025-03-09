"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { FeeSchema } from "@/types/convex-schemas";
import { FeeFormData } from "@/types/form-types";

interface FeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    feeData: FeeFormData
  ) => Promise<boolean>;
  onEdit: (feeId: Id<"fees">, feeData: FeeFormData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: FeeSchema | null;
}

const FeeModal: React.FC<FeeModalProps> = ({
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
  const [formData, setFormData] = useState<FeeFormData>({
    name: "",
    price: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
      });
    } else {
      setFormData({
        name: "",
        price: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    if (initialData) {
      await onEdit(initialData._id, formData);
    } else {
      await onCreate(companyId, formData);
    }

    onClose();
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Fee Name</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter fee name"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium">Price</Label>
        <Input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleInputChange}
          placeholder="Enter price"
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Saving..." : initialData ? "Save Changes" : "Add Fee"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{initialData ? "Edit Fee" : "Add Fee"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{initialData ? "Edit Fee" : "Add Fee"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default FeeModal;
