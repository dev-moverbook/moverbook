"use client";

import React, { useState, useEffect } from "react";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { CreateFeeData, FeeFormData } from "@/types/form-types";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import { validatePrice } from "@/app/frontendUtils/validation";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";

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
  initialData?: Doc<"fees"> | null;
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
  const [formData, setFormData] = useState<FeeFormData>({
    name: "",
    price: null,
  });
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
      });
    } else {
      setFormData({ name: "", price: null });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
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

    const success = initialData
      ? await onEdit(initialData._id, safeFeeData)
      : await onCreate(companyId, safeFeeData);

    if (success) onClose();
  };

  const isDisabled =
    formData.name.trim() === "" ||
    formData.price === null ||
    formData.price === undefined;

  const title = initialData ? "Edit Fee" : "Add Fee";
  const description = initialData
    ? "Update fee name and price."
    : "Enter the name of the fee and its associated price.";

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

      <CurrencyInput
        label="Price"
        value={formData.price}
        isEditing={true}
        onChange={(value) => {
          setFormData((prev) => ({
            ...prev,
            price: value ?? null,
          }));
        }}
        error={errors.price}
      />

      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={onClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Fee"}
        cancelLabel="Cancel"
        disabled={isDisabled}
      />
    </FieldGroup>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      children={formContent}
    />
  );
};

export default FeeModal;
