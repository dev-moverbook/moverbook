import React, { useEffect, useState } from "react";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import {
  DiscountValidationErrors,
  validateDiscountForm,
} from "@/app/frontendUtils/validation";
import FormActions from "@/app/components/shared/FormActions";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";
import { Doc } from "@/convex/_generated/dataModel";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discount: DiscountFormData) => void;
  initialData?: Doc<"discounts"> | null;
  isLoading: boolean;
  errorMessage?: string | null;
}

export interface DiscountFormData {
  name: string;
  price: number | null;
}

const DiscountModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  errorMessage,
}: DiscountModalProps) => {
  const [errors, setErrors] = useState<DiscountValidationErrors>({});
  const [formData, setFormData] = useState<DiscountFormData>({
    name: "",
    price: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
      });
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({ name: "", price: null });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const trimmedName = formData.name.trim();
    const { isValid, errors } = validateDiscountForm({
      name: trimmedName,
      price: formData.price,
    });
    if (!isValid) {
      setErrors(errors);
      return;
    }

    onSubmit({ ...formData, name: trimmedName });
    handleClose();
  };

  const isDisabled = formData.name.trim() === "" || formData.price === null;
  const title = initialData ? "Update Discount" : "Add Discount";
  const description = initialData
    ? "Edit the discount details."
    : "Add a new discount to this move.";

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Discount Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter Discount"
        error={errors.name}
      />
      <CurrencyInput
        label="Price"
        value={formData.price}
        onChange={(val) => {
          setFormData((prev) => ({
            ...prev,
            price: val ? Math.round(val * 100) / 100 : null,
          }));
          if (errors.price) {
            setErrors({ ...errors, price: undefined });
          }
        }}
        error={errors.price}
        isEditing={true}
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        saveLabel={initialData ? "Update Discount" : "Add Discount"}
        cancelLabel="Cancel"
        disabled={isDisabled}
        isSaving={isLoading}
        error={errorMessage}
      />
    </FieldGroup>
  );

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

export default DiscountModal;
