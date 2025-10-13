import React, { useEffect, useState } from "react";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import ResponsiveModal from "../modal/ResponsiveModal";

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

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={`Enter the ${label}`}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default CounterModal;
