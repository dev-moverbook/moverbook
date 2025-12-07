"use client";

import { useEffect, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FieldRow from "@/components/shared/field/FieldRow";
import FormActions from "@/components/shared/buttons/FormActions";
import LabeledSelect from "@/components/shared/labeled/LabeledSelect";
import CounterInput from "@/components/shared/labeled/CounterInput";
import TagLabel from "@/components/shared/labeled/TagLabel";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import {
  AdditionalFeeValidationErrors,
  validateAdditionalFeeForm,
} from "@/frontendUtils/validation";

interface AdditionalFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fee: AdditionalFeeFormData) => void;
  initialData?: Doc<"additionalFees"> | null;
  moveFeeOptions?: Doc<"fees">[];
  isLoading: boolean;
  errorMessage?: string | null;
}

export interface AdditionalFeeFormData {
  name: string;
  price: number | null;
  quantity: number;
  feeId?: Id<"fees">;
}

const AdditionalFeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  moveFeeOptions,
  isLoading,
  errorMessage,
}: AdditionalFeeModalProps) => {
  const [formData, setFormData] = useState<AdditionalFeeFormData>({
    name: "",
    price: null,
    quantity: 1,
  });
  const [errors, setErrors] = useState<AdditionalFeeValidationErrors>({});
  const [isCustomFee, setIsCustomFee] = useState<boolean>(false);

  const feeOptions =
    moveFeeOptions?.map((fee) => ({
      label: fee.name,
      value: fee.name,
    })) ?? [];

  useEffect(() => {
    if (initialData) {
      const matchedOption = initialData.feeId
        ? moveFeeOptions?.find((option) => option._id === initialData.feeId)
        : null;

      if (matchedOption) {
        setFormData({
          name: matchedOption.name,
          price: matchedOption.price,
          quantity: initialData.quantity,
        });
        setIsCustomFee(false);
      } else {
        setFormData({
          name: initialData.name,
          price: initialData.price,
          quantity: initialData.quantity,
        });
        setIsCustomFee(true);
      }
    }
  }, [initialData, moveFeeOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateAdditionalFeeForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: null,
      quantity: 1,
    });
    setErrors({});
    setIsCustomFee(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isDisabled =
    formData.name === "" || !formData.price || formData.quantity === 0;

  const title = initialData ? "Update Fee" : "Add Fee";
  const description = initialData
    ? "Edit fee name, price, or quantity."
    : "Create a new fee for this move. Use preset fees or enter a custom name and price.";

  const formContent = (
    <FieldGroup>
      <div>
        <TagLabel
          label="Fee"
          buttonText={isCustomFee ? "Preset" : "Custom"}
          onToggle={() => setIsCustomFee((prev) => !prev)}
        />
        {isCustomFee ? (
          <FieldRow
            label=""
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Fee Name"
            error={errors.name}
          />
        ) : (
          <LabeledSelect
            label=""
            value={formData.name}
            onChange={(value) => {
              const selectedFee = moveFeeOptions?.find(
                (fee) => fee.name === value
              );
              setFormData({
                ...formData,
                name: value,
                price: selectedFee?.price ?? null,
              });
              setErrors((prev) => ({
                ...prev,
                name: undefined,
                price: undefined,
              }));
            }}
            options={feeOptions}
            loading={isLoading}
            error={errors.name || errorMessage}
          />
        )}
      </div>

      <CurrencyInput
        label="Price"
        value={formData.price}
        onChange={(val) => {
          setFormData((prev) => ({
            ...prev,
            price: val ? Math.round(val * 100) / 100 : null,
          }));
          if (errors.price) {
            setErrors((prev) => ({
              ...prev,
              name: undefined,
              price: undefined,
            }));
          }
        }}
        error={errors.price}
        isEditing={true}
      />

      <CounterInput
        label="Quantity"
        value={formData.quantity}
        onChange={(value) => {
          if (value !== null) {
            setFormData((prev) => ({
              ...prev,
              quantity: value,
            }));
          }
        }}
        min={1}
        max={10}
        error={errors.quantity}
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        saveLabel={initialData ? "Update Fee" : "Add Fee"}
        cancelLabel="Cancel"
        disabled={isDisabled}
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

export default AdditionalFeeModal;
