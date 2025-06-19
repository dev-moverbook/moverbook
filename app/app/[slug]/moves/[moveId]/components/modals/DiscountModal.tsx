import React, { useEffect, useState } from "react";
import { DiscountSchema } from "@/types/convex-schemas";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";
import { MOBILE_BREAKPOINT } from "@/types/const";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import {
  DiscountValidationErrors,
  validateDiscountForm,
} from "@/app/frontendUtils/validation";
import FormActions from "@/app/components/shared/FormActions";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discount: DiscountFormData) => void;
  initialData?: DiscountSchema | null;
  isLoading: boolean;
  errorMessage?: string | null;
}

export interface DiscountFormData {
  name: string;
  price: string;
}

const DiscountModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  errorMessage,
}: DiscountModalProps) => {
  const isMobile = useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
  const [errors, setErrors] = useState<DiscountValidationErrors>({});

  const [formData, setFormData] = useState<DiscountFormData>({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
      });
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: DiscountFormData) => ({
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

    onSubmit(formData);

    handleClose();
  };

  const isDisabled =
    formData.name.trim() === "" ||
    formData.price.trim() === "" ||
    isNaN(parseFloat(formData.price));

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
      <FieldRow
        label="Price"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Enter Price"
        error={errors.price}
        step={0.01}
        min={0}
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

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>
          {initialData ? "Update Discount" : "Add Discount"}
        </DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>
          {initialData ? "Update Discount" : "Add Discount"}
        </DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default DiscountModal;
