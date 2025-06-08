import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import { MOBILE_BREAKPOINT } from "@/types/const";

interface CounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: number) => void;
  title: string;
  label: string;
  min?: number;
  step?: number;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const CounterModal: React.FC<CounterModalProps> = ({
  isOpen,
  onClose,
  onChange,
  title,
  label,
  min = 0,
  step = 1,
  inputRef,
}) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  const [errors, setErrors] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setQuantity("");
      setErrors(null);
      setTimeout(() => {
        inputRef?.current?.focus();
        inputRef?.current?.select();
      }, 50); // Delay for mobile keyboard
    }
  }, [isOpen, inputRef]);

  const handleSubmit = () => {
    const num = Number(quantity);
    if (!quantity || isNaN(num)) {
      setErrors("Quantity is required");
      return;
    }
    onChange(num);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  };

  const formContent = (
    <FieldGroup>
      <FieldRow
        label={label}
        name="quantity"
        type="number"
        value={quantity}
        onChange={handleInputChange}
        placeholder={`Enter ${label}`}
        error={errors}
        min={min}
        step={step}
        inputRef={inputRef}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={onClose}
        error={errors}
        saveLabel={title}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

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

export default CounterModal;
