"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AddMoveLineItemInput, MoveFeeInput } from "@/types/form-types";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FieldRow from "@/components/shared/field/FieldRow";
import FormActions from "@/components/shared/buttons/FormActions";
import LabeledSelect from "@/components/shared/labeled/LabeledSelect";
import CounterInput from "@/components/shared/labeled/CounterInput";
import {
  AddLineValidationErrors,
  validateAddLineForm,
} from "@/frontendUtils/validation";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";
import TagLabel from "@/components/shared/labeled/TagLabel";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
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
  const isEditMode = !!initialData;

  // Reset state every time modal opens
  const [formData, setFormData] = useState<AddMoveLineItemInput>({
    name: "",
    price: null,
    quantity: 1,
  });
  const [errors, setErrors] = useState<AddLineValidationErrors>({});
  const [isCustomFee, setIsCustomFee] = useState<boolean>(false);

  const feeOptions = useMemo(
    () =>
      moveFeeOptions?.map((fee) => ({ label: fee.name, value: fee.name })) ??
      [],
    [moveFeeOptions]
  );

  // Reset form whenever modal opens or initialData changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const feeExists = feeOptions.some(
        (opt) => opt.value === initialData.name
      );
      setIsCustomFee(!feeExists);
      setFormData({
        name: initialData.name,
        price: initialData.price,
        quantity: initialData.quantity,
      });
    } else {
      setFormData({ name: "", price: null, quantity: 1 });
      setIsCustomFee(false);
    }
    setErrors({});
  }, [isOpen, initialData, feeOptions]);

  const hasChanges = useMemo(() => {
    if (!isEditMode) return true;
    return (
      formData.name !== initialData?.name ||
      formData.price !== initialData?.price ||
      formData.quantity !== initialData?.quantity
    );
  }, [formData, initialData, isEditMode]);

  const isFormInvalid =
    formData.name.trim() === "" ||
    formData.price === null ||
    formData.price <= 0 ||
    formData.quantity < 1;

  const isSaveDisabled = !hasChanges || isFormInvalid;

  const handleSubmit = () => {
    const { isValid, errors } = validateAddLineForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      price: Number(formData.price!.toFixed(2)),
      quantity: formData.quantity,
    });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Update Fee" : "Add Fee"}
      description={
        isEditMode
          ? "Edit line item details."
          : "Add a custom or preset line item to this move."
      }
    >
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
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
                  name: value,
                  price: selectedFee?.price ?? null,
                  quantity: formData.quantity,
                });
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              options={feeOptions}
              loading={isLoading}
              error={errors.name || errorMessage}
              placeholder="Select a preset fee"
            />
          )}
        </div>

        <CurrencyInput
          label="Price"
          value={formData.price}
          onChange={(val) => {
            setFormData((prev) => ({
              ...prev,
              price: val != null ? Math.round(val * 100) / 100 : null,
            }));
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
          max={100}
          error={errors.quantity}
        />

        <FormActions
          onSave={handleSubmit}
          onCancel={onClose}
          saveLabel={isEditMode ? "Update Fee" : "Add Fee"}
          cancelLabel="Cancel"
          disabled={isSaveDisabled}
          isSaving={isLoading}
        />
      </FieldGroup>
    </ResponsiveModal>
  );
};

export default AddLineModal;
