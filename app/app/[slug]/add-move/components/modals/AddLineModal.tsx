import React, { useEffect, useMemo, useState } from "react";
import { AddMoveLineItemInput, MoveFeeInput } from "@/types/form-types";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import CounterInput from "@/app/components/shared/labeled/CounterInput";
import {
  AddLineValidationErrors,
  validateAddLineForm,
} from "@/app/frontendUtils/validation";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import TagLabel from "@/app/components/shared/labeled/TagLabel";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";
import { Doc } from "@/convex/_generated/dataModel";

interface AddLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fee: MoveFeeInput) => void;
  initialData?: MoveFeeInput | null;
  moveFeeOptions?: Doc<"fees">[];
  isLoading: boolean;
  errorMessage?: string | null;
}

const AddLineModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  moveFeeOptions,
  isLoading,
  errorMessage,
}: AddLineModalProps) => {
  const [formData, setFormData] = useState<AddMoveLineItemInput>({
    name: "",
    price: null,
    quantity: 1,
  });
  const [errors, setErrors] = useState<AddLineValidationErrors>({});
  const [isCustomFee, setIsCustomFee] = useState<boolean>(false);

  // Memoize to stabilize dependency identity
  const feeOptions = useMemo(
    () =>
      moveFeeOptions?.map((fee) => ({ label: fee.name, value: fee.name })) ??
      [],
    [moveFeeOptions]
  );

  useEffect(() => {
    if (initialData) {
      const feeExists = feeOptions.some(
        (opt) => opt.value === initialData.name
      );
      setIsCustomFee(!feeExists);
      setFormData(initialData);
    }
  }, [initialData, feeOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateAddLineForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    const newFee: MoveFeeInput = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };
    onSubmit(newFee);
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
    ? "Edit line item details."
    : "Add a custom or preset line item to this move.";

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
            queryError={errorMessage}
            error={errors.name}
          />
        )}
      </div>

      <CurrencyInput
        label="Price"
        value={formData.price}
        onChange={(val) => {
          setFormData((prev) => ({
            ...prev,
            // keep two decimals; allow clearing to null
            price: val != null ? Math.round(val * 100) / 100 : null,
          }));
          // ✅ remove price error without unused var warning
          setErrors((prev) => {
            if (!prev.price) return prev;
            const next = { ...prev };
            delete next.price;
            return next;
          });
        }}
        error={errors.price}
        isEditing={true}
      />

      <CounterInput
        label="Quantity"
        value={formData.quantity}
        onChange={(value) => {
          if (value !== null) {
            setFormData((prev) => ({ ...prev, quantity: value }));
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

export default AddLineModal;
