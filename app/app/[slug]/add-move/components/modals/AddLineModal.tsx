import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MOBILE_BREAKPOINT } from "@/types/const";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import { AddMoveLineItemInput, MoveFeeInput } from "@/types/form-types";
import CheckboxField from "@/app/components/shared/CheckboxField";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import CounterInput from "@/app/components/shared/labeled/CounterInput";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import {
  AddLineValidationErrors,
  validateAddLineForm,
} from "@/app/frontendUtils/validation";

interface AddLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fee: MoveFeeInput) => void;
  initialData?: MoveFeeInput | null;
}

const AddLineModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddLineModalProps) => {
  const { moveFeeOptions, isLoading, errorMessage } = useMoveForm();
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  const [formData, setFormData] = useState<AddMoveLineItemInput>({
    name: "",
    price: null,
    quantity: 1,
  });
  const [errors, setErrors] = useState<AddLineValidationErrors>({});
  const [isCustomFee, setIsCustomFee] = useState<boolean>(false);

  const feeOptions =
    moveFeeOptions?.map((fee) => ({
      label: fee.name,
      value: fee.name,
    })) ?? [];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: AddMoveLineItemInput) => ({
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

  const handleClose = () => {
    onClose();
  };

  const isDisabled =
    formData.name === "" || !formData.price || formData.quantity === 0;

  const formContent = (
    <FieldGroup>
      <CheckboxField
        label="Custom Fee"
        checked={isCustomFee}
        onChange={() => setIsCustomFee((prev) => !prev)}
        id="custom-fee"
      />

      {isCustomFee ? (
        <FieldRow
          label="Fee Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter Fee Name"
          error={errors.name}
        />
      ) : (
        <LabeledSelect
          label="Fee"
          value={formData.name}
          onChange={(value) => {
            setFormData({ ...formData, name: value });
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          options={feeOptions}
          loading={isLoading}
          queryError={errorMessage}
          error={errors.name}
        />
      )}
      <FieldRow
        label="Price"
        type="number"
        name="price"
        value={formData.price?.toString() ?? ""}
        onChange={handleInputChange}
        placeholder="Enter Price"
        error={errors.price}
        step={0.01}
        min={0}
      />
      <CounterInput
        label="Quantity"
        value={formData.quantity}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            quantity: value,
          }))
        }
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

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{initialData ? "Update Fee" : "Add Fee"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{initialData ? "Update Fee" : "Add Fee"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default AddLineModal;
