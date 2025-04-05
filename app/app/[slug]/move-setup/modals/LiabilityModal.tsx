"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Id } from "@/convex/_generated/dataModel";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import { InsurancePolicyFormData } from "@/types/form-types";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import CheckboxField from "@/app/components/shared/CheckboxField";
import FormActions from "@/app/components/shared/FormActions";
import { validatePrice } from "@/app/frontendUtils/validation";

interface LiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    companyId: Id<"companies">,
    policyData: InsurancePolicyFormData
  ) => Promise<boolean>;
  onEdit: (
    policyId: Id<"insurancePolicies">,
    policyData: InsurancePolicyFormData
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  companyId: Id<"companies">;
  initialData?: InsurancePolicySchema | null;
}

const LiabilityModal: React.FC<LiabilityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  loading,
  error,
  companyId,
  initialData,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [formData, setFormData] = useState<InsurancePolicyFormData>({
    name: "",
    coverageAmount: 0,
    coverageType: 0,
    premium: 0,
    isDefault: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof InsurancePolicyFormData, string>>
  >({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        coverageAmount: initialData.coverageAmount,
        coverageType: initialData.coverageType,
        premium: initialData.premium,
        isDefault: initialData.isDefault,
      });
    } else {
      resetState();
    }
  }, [initialData]);

  const resetState = () => {
    setFormData({
      name: "",
      coverageAmount: 0,
      coverageType: 0,
      premium: 0,
      isDefault: false,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateInsuranceForm = (data: InsurancePolicyFormData) => {
    const newErrors: Partial<Record<keyof InsurancePolicyFormData, string>> =
      {};

    if (!data.name.trim()) {
      newErrors.name = "Policy name is required.";
    }

    const priceFields: (keyof InsurancePolicyFormData)[] = [
      "coverageAmount",
      "coverageType",
      "premium",
    ];

    for (const key of priceFields) {
      const value = data[key];
      if (typeof value === "number") {
        const error = validatePrice(value);
        if (error) newErrors[key] = error;
      }
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateInsuranceForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const success = initialData
      ? await onEdit(initialData._id, formData)
      : await onCreate(companyId, formData);

    if (success) {
      handleClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const formContent = (
    <FieldGroup>
      <FieldRow
        label="Policy Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter policy name"
        error={errors.name}
      />

      <FieldRow
        label="Coverage Amount"
        name="coverageAmount"
        type="number"
        value={formData.coverageAmount.toString()}
        onChange={handleInputChange}
        placeholder="Enter coverage amount"
        error={errors.coverageAmount}
      />

      <FieldRow
        label="Coverage Type"
        name="coverageType"
        type="number"
        value={formData.coverageType.toString()}
        onChange={handleInputChange}
        placeholder="Enter coverage type"
        error={errors.coverageType}
      />

      <FieldRow
        label="Premium"
        name="premium"
        type="number"
        value={formData.premium.toString()}
        onChange={handleInputChange}
        placeholder="Enter premium"
        error={errors.premium}
      />

      <CheckboxField
        id="isDefault"
        label="Is Default"
        checked={formData.isDefault}
        onChange={(checked) =>
          setFormData((prev) => ({ ...prev, isDefault: checked }))
        }
      />

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Policy"}
        cancelLabel="Cancel"
      />
    </FieldGroup>
  );

  const title = initialData ? "Edit Policy" : "Add Policy";

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>{title}</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default LiabilityModal;
