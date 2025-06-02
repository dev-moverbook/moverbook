"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Id } from "@/convex/_generated/dataModel";
import { ItemSchema } from "@/types/convex-schemas";
import { ItemFormData } from "@/types/form-types";
import { FrontEndErrorMessages } from "@/types/errors";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import FormActions from "@/app/components/shared/FormActions";
import CheckboxField from "@/app/components/shared/CheckboxField";
import SizeSelector from "@/app/components/shared/labeled/SizeSelector";
import { calculateWeightFromSize } from "@/utils/helper";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    itemData: ItemFormData,
    categoryId?: Id<"categories">
  ) => Promise<boolean>;
  onEdit: (itemId: Id<"items">, itemData: ItemFormData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  categoryId?: Id<"categories">;
  initialData?: ItemSchema | null;
}

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  categoryId,
  initialData,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    size: null,
    isPopular: false,
    weight: null,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        size: initialData.size,
        isPopular: initialData.isPopular || false,
        weight: initialData.weight,
      });
    } else {
      setFormData({
        name: "",
        size: null,
        isPopular: false,
        weight: null,
      });
    }
    setValidationError(null);
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPopular: checked,
    }));
  };

  const handleSizeSelect = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      size,
      weight: calculateWeightFromSize(size),
    }));
  };

  const handleWeightChange = (weight: number) => {
    setFormData((prev) => ({
      ...prev,
      weight,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError(FrontEndErrorMessages.ITEM_NAME_REQUIRED);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (initialData) {
      await onEdit(initialData._id, formData);
    } else {
      await onCreate(companyId, formData, categoryId);
    }

    onClose();
  };

  const formContent = (
    <FieldGroup>
      <LabeledInput
        label="Item Name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter item name"
      />

      {/* Size Selection */}
      <SizeSelector
        value={formData.size || 0}
        onChange={handleSizeSelect}
        label="Click a preset size or enter a custom size"
      />

      <LabeledInput
        label="Item Size (ft³)"
        placeholder="Enter Custom Size (ft³)"
        value={formData.size?.toString() || ""}
        onChange={(e) => handleSizeSelect(Number(e.target.value))}
        type="number"
        min={1}
      />

      <LabeledInput
        label="Item Weight (lbs)"
        value={formData.weight?.toString() || ""}
        onChange={(e) => handleWeightChange(Number(e.target.value))}
        placeholder="Enter item weight (lbs)"
        type="number"
        min={1}
      />

      {/* Popular Checkbox */}
      <CheckboxField
        id="isPopular"
        label="Mark as Popular Item"
        checked={formData.isPopular}
        onChange={handleCheckboxChange}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={onClose}
        isSaving={loading}
        error={error || validationError}
        saveLabel={initialData ? "Update Item" : "Add Item"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerTitle>{initialData ? "Edit Item" : "Add Item"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{initialData ? "Edit Item" : "Add Item"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
