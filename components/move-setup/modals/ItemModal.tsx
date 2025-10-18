"use client";

import React, { useState, useEffect } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ItemFormData } from "@/types/form-types";
import { FrontEndErrorMessages } from "@/types/errors";
import FieldGroup from "@/components/shared/FieldGroup";
import FormActions from "@/components/shared/FormActions";
import CheckboxField from "@/components/shared/CheckboxField";
import SizeSelector from "@/components/shared/labeled/SizeSelector";
import { calculateWeightFromSize } from "@/utils/helper";
import FieldRow from "@/components/shared/FieldRow";
import NumberInput from "@/components/shared/labeled/NumberInput";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import { ItemCreateInput } from "../hooks/useCreateItem";
import { toItemCreateInput } from "@/frontendUtils/transform";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    itemData: ItemCreateInput,
    categoryId?: Id<"categories">
  ) => Promise<boolean>;
  onEdit: (itemId: Id<"items">, itemData: ItemCreateInput) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  categoryId?: Id<"categories">;
  initialData?: Doc<"items"> | null;
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

    const res = toItemCreateInput(formData);
    if (!res.ok) {
      setValidationError(res.error);
      return;
    }
    const itemData = res.value;

    if (initialData) {
      await onEdit(initialData._id, itemData);
    } else {
      await onCreate(companyId, itemData, categoryId);
    }

    onClose();
  };

  const isDisabled =
    !formData.name.trim() || !formData.size || !formData.weight;

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Item Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter item name"
        error={validationError}
      />

      {/* Size Selection */}
      <SizeSelector
        value={formData.size || 0}
        onChange={handleSizeSelect}
        label="Click a preset size or enter a custom size"
      />
      <NumberInput
        label="Item Size (ft³)"
        value={formData.size}
        onChange={(value) => handleSizeSelect(value ?? 0)}
        error={validationError}
        unit="ft³"
      />

      <NumberInput
        label="Item Weight (lbs)"
        value={formData.weight}
        onChange={(value) => handleWeightChange(value ?? 0)}
        error={validationError}
        unit="lbs"
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
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Item" : "Add Item";
  const description = initialData
    ? "Update the item name, size, and weight. You can also mark it as popular."
    : "Enter the item name, select or enter a custom size and weight. Optionally, mark the item as popular.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      heightVh={95}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default ItemModal;
