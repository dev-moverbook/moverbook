import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MOBILE_BREAKPOINT } from "@/types/const";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";

interface EditItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newQuantity: number) => void;
}

const EditItemsModal = ({ isOpen, onClose, onSubmit }: EditItemsModalProps) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
  const [quantity, setQuantity] = useState<number>(1);

  // Callback ref to focus and select input when it mounts
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
        inputRef={inputCallbackRef} // Use the callback ref here
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        saveLabel={"Update"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{"Update Item(s)"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{"Update Item(s)"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default EditItemsModal;
