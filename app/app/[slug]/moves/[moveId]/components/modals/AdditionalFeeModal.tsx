import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MOBILE_BREAKPOINT } from "@/types/const";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import CheckboxField from "@/app/components/shared/CheckboxField";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import CounterInput from "@/app/components/shared/labeled/CounterInput";
import {
  AdditionalFeeValidationErrors,
  validateAdditionalFeeForm,
} from "@/app/frontendUtils/validation";
import { AdditionalFeeSchema, FeeSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";

interface AdditionalFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fee: AdditionalFeeFormData) => void;
  initialData?: AdditionalFeeSchema | null;
  moveFeeOptions?: FeeSchema[];
  isLoading: boolean;
  errorMessage?: string | null;
}

export interface AdditionalFeeFormData {
  name: string;
  price: string;
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
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });

  const [formData, setFormData] = useState<AdditionalFeeFormData>({
    name: "",
    price: "",
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
          price: matchedOption.price.toString(),
          quantity: initialData.quantity,
        });
        setIsCustomFee(false);
      } else {
        setFormData({
          name: initialData.name,
          price: initialData.price.toString(),
          quantity: initialData.quantity,
        });
        setIsCustomFee(true);
      }
    }
  }, [initialData, moveFeeOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: AdditionalFeeFormData) => ({
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
      price: "",
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
            const selectedFee = moveFeeOptions?.find(
              (fee) => fee.name === value
            );
            setFormData({
              ...formData,
              name: value,
              price: selectedFee?.price?.toString() ?? "",
              feeId: selectedFee?._id,
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

export default AdditionalFeeModal;
