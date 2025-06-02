"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Id } from "@/convex/_generated/dataModel";
import { FeeSchema } from "@/types/convex-schemas";
import { CreateFeeData, FeeFormData } from "@/types/form-types";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import { validatePrice } from "@/app/frontendUtils/validation";
import { MOBILE_BREAKPOINT } from "@/types/const";

interface FeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    feeData: CreateFeeData
  ) => Promise<boolean>;
  onEdit: (feeId: Id<"fees">, feeData: CreateFeeData) => Promise<boolean>;
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
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
  const [formData, setFormData] = useState<FeeFormData>({
    name: "",
    price: 0,
  });
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
      });
    } else {
      setFormData({
        name: "",
        price: null,
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

  const validateFeeForm = (formData: FeeFormData) => {
    const newErrors: { name?: string; price?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Fee name is required.";
    }

    const priceError = validatePrice(formData.price);
    if (priceError) {
      newErrors.price = priceError;
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFeeForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const safeFeeData: CreateFeeData = {
      ...formData,
      price: formData.price as number,
    };

    if (initialData) {
      await onEdit(initialData._id, safeFeeData);
    } else {
      await onCreate(companyId, safeFeeData);
    }

    onClose();
  };

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Fee Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter Fee Name"
        error={errors.name}
      />

      <FieldRow
        label="Price"
        name="price"
        type="number"
        value={formData.price !== null ? formData.price.toString() : ""}
        onChange={handleInputChange}
        placeholder="Enter Price"
        error={errors.price}
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={onClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Fee"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
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
