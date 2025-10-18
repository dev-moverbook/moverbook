"use client";

import React, { useEffect, useState } from "react";
import { FormMoveItemInput, MoveItemInput } from "@/types/form-types";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FormActions from "@/components/shared/buttons/FormActions";
import SizeSelector from "@/components/shared/labeled/SizeSelector";
import { calculateWeightFromSize } from "@/utils/helper";
import { validateMoveItemForm } from "@/frontendUtils/validation";
import FieldRow from "@/components/shared/field/FieldRow";
import CounterInput from "@/components/shared/labeled/CounterInput";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import NumberInput from "@/components/shared/labeled/NumberInput";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: string | null;
  addMoveItem: (item: MoveItemInput) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  selectedRoom,
  addMoveItem,
}) => {
  const [formData, setFormData] = useState<FormMoveItemInput>({
    item: "",
    room: selectedRoom || "Unassigned",
    quantity: 1,
    weight: null,
    size: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormMoveItemInput, string>>
  >({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      room: selectedRoom || "Unassigned",
    }));
  }, [selectedRoom]);

  const isDisabled =
    !formData.item.trim() ||
    !formData.room.trim() ||
    !formData.quantity ||
    !formData.weight ||
    !formData.size;

  const resetFormData = () => {
    setFormData({
      item: "",
      room: "Unassigned",
      quantity: 1,
      weight: null,
      size: null,
    });
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleItemChange = (item: string) => {
    setFormData((prev) => ({ ...prev, item }));
  };

  const handleSizeSelect = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      size,
      weight: calculateWeightFromSize(size),
    }));
  };

  const handleWeightChange = (weight: number) => {
    setFormData((prev) => ({ ...prev, weight }));
  };

  const handleQuantityChange = (quantity: number) => {
    setFormData((prev) => ({ ...prev, quantity }));
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateMoveItemForm(formData);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    const cleanData: MoveItemInput = {
      item: formData.item.trim(),
      room: formData.room.trim(),
      quantity: formData.quantity as number,
      weight: formData.weight as number,
      size: formData.size as number,
    };

    addMoveItem(cleanData);
    handleClose();
  };

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Item Name"
        value={formData.item}
        onChange={(e) => handleItemChange(e.target.value)}
        placeholder="Enter item name"
        error={errors.item}
        name="item"
      />

      <SizeSelector
        value={formData.size || 0}
        onChange={handleSizeSelect}
        label="Item Preset Size"
      />

      <NumberInput
        label="Item Size (ft³)"
        placeholder="Enter Item Size (ft³)"
        value={formData.size || null}
        onChange={(value) => handleSizeSelect(value || 0)}
        error={errors.size}
        unit="ft³"
      />
      <NumberInput
        label="Item Weight (lbs)"
        placeholder="Enter Item Weight (lbs)"
        value={formData.weight || null}
        onChange={(value) => handleWeightChange(value || 0)}
        error={errors.weight}
        unit="lbs"
      />

      <CounterInput
        label="Quantity"
        value={formData.quantity}
        onChange={(value) => {
          handleQuantityChange(value);
        }}
        min={1}
        max={10}
        error={errors.quantity}
      />

      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        saveLabel="Add Item"
        cancelLabel="Cancel"
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  const title = "Add Item";
  const description =
    "Add an item to this move. Pick a preset size to auto-calc weight, or enter custom size and weight. Adjust quantity as needed.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default AddItemModal;
