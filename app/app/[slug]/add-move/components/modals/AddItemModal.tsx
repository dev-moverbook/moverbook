"use client";

import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FormMoveItemInput, MoveItemInput } from "@/types/form-types";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import FormActions from "@/app/components/shared/FormActions";
import SizeSelector from "@/app/components/shared/labeled/SizeSelector";
import { calculateWeightFromSize } from "@/utils/helper";
import { MOBILE_BREAKPOINT } from "@/types/const";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { validateMoveItemForm } from "@/app/frontendUtils/validation";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const { addMoveItem } = useMoveForm();
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
  const [formData, setFormData] = useState<FormMoveItemInput>({
    item: "",
    room: "Unassigned",
    quantity: 1,
    weight: null,
    size: null,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormMoveItemInput, string>>
  >({});

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
    setFormData((prev) => ({
      ...prev,
      item,
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

  const handleQuantityChange = (quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity,
    }));
  };

  const handleSubmit = async () => {
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
      <LabeledInput
        label="Item Name"
        value={formData.item}
        onChange={(e) => handleItemChange(e.target.value)}
        placeholder="Enter item name"
        error={errors.item}
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
        error={errors.size}
      />

      <LabeledInput
        label="Item Weight (lbs)"
        value={formData.weight?.toString() || ""}
        onChange={(e) => handleWeightChange(Number(e.target.value))}
        placeholder="Enter item weight (lbs)"
        type="number"
        min={1}
        error={errors.weight}
      />
      <LabeledInput
        label="Quantity"
        value={formData.quantity?.toString() || ""}
        onChange={(e) => handleQuantityChange(Number(e.target.value))}
        placeholder="Enter quantity"
        type="number"
        min={1}
        error={errors.quantity}
      />

      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        saveLabel={"Add Item"}
        cancelLabel="Cancel"
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{"Add Item"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{"Add Item"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
