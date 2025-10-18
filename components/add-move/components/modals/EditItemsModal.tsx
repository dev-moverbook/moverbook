import React, { useState } from "react";
import FieldGroup from "@/components/shared/FieldGroup";
import FormActions from "@/components/shared/FormActions";
import LabeledInput from "@/components/shared/labeled/LabeledInput";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";

interface EditItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newQuantity: number) => void;
}

const EditItemsModal = ({ isOpen, onClose, onSubmit }: EditItemsModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const inputCallbackRef = (node: HTMLInputElement | null) => {
    if (isOpen && node) {
      setTimeout(() => {
        node.focus();
        node.select();
      }, 50); // Slight delay ensures input is in the DOM
    }
  };

  const handleSubmit = () => {
    onSubmit(quantity);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const formContent = (
    <FieldGroup>
      <LabeledInput
        label="Quantity"
        value={quantity.toString()}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 1) setQuantity(val);
        }}
        type="number"
        inputRef={inputCallbackRef}
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        saveLabel={"Update"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  const title = "Update Item(s)";
  const description = "Update the quantity of the item(s).";

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

export default EditItemsModal;
