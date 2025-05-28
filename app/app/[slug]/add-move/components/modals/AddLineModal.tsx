import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { MOVILE_BREAKPOINT } from "@/types/const";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import { FeeFormData, FeeLineItemFormData } from "@/types/form-types";
import { useCompanyFees } from "@/app/hooks/queries/useCompanyFees";
import { Id } from "@/convex/_generated/dataModel";
import DataLoader from "@/app/components/shared/containers/DataLoader";
import CheckboxField from "@/app/components/shared/CheckboxField";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import CounterInput from "@/app/components/shared/labeled/CounterInput";

interface AddLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: Id<"companies"> | null;
}

const AddLineModal = ({ isOpen, onClose, companyId }: AddLineModalProps) => {
  const isMobile = useMediaQuery({ maxWidth: MOVILE_BREAKPOINT });
  const [formData, setFormData] = useState<FeeLineItemFormData>({
    name: "",
    price: 0,
    quantity: 1,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    quantity?: string;
  }>({});
  const [isCustomFee, setIsCustomFee] = useState<boolean>(false);
  const { data, isLoading, isError, errorMessage, options } =
    useCompanyFees(companyId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FeeLineItemFormData) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      price: 0,
      quantity: 1,
    });
    setIsCustomFee(false);
    onClose();
  };

  const formContent = (
    <FieldGroup>
      <CheckboxField
        label="Custom Fee"
        checked={isCustomFee}
        onChange={() => setIsCustomFee(!isCustomFee)}
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
            setErrors({ ...errors, name: undefined });
          }}
          options={options}
          loading={isLoading}
          queryError={errorMessage}
        />
      )}

      <FieldRow
        label="Price"
        name="price"
        type="number"
        value={formData.price !== null ? formData.price.toString() : ""}
        onChange={handleInputChange}
        placeholder="Enter Price"
        error={errors.price}
      />
      <CounterInput
        label="Quantity"
        value={formData.quantity}
        onChange={(value) => {
          setFormData({ ...formData, quantity: value });
          setErrors({ ...errors, quantity: undefined });
        }}
        min={1}
        max={10}
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={onClose}
        saveLabel="Add Fee"
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{"Add Fee"}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{"Add Fee"}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default AddLineModal;
