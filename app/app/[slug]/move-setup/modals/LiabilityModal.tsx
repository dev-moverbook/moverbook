"use client";

import React, { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import { InsurancePolicyFormData } from "@/types/form-types";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import FormActions from "@/app/components/shared/FormActions";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";
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
  const [formData, setFormData] = useState<InsurancePolicyFormData>({
    name: "",
    coverageAmount: null,
    coverageType: null,
    premium: null,
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
      });
    } else {
      resetState();
    }
  }, [initialData]);

  const resetState = () => {
    setFormData({
      name: "",
      coverageAmount: null,
      coverageType: null,
      premium: null,
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

  const isDisabled =
    formData.coverageType === null ||
    formData.coverageAmount === null ||
    formData.premium === null ||
    formData.name.trim() === "";

  const title = initialData ? "Edit Policy" : "Add Policy";
  const description = initialData
    ? "Update the details of this liability policy."
    : "Create a new liability policy to include in your company settings.";

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

      <CurrencyInput
        label="Coverage Type ($/lb)"
        value={formData.coverageType}
        isEditing={true}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, coverageType: value ?? null }))
        }
        error={errors.coverageType}
        suffix="/lb"
      />

      <CurrencyInput
        label="Premium"
        value={formData.premium}
        isEditing={true}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, premium: value ?? null }))
        }
        error={errors.premium}
      />

      <CurrencyInput
        label="Coverage Amount ($/lb)"
        value={formData.coverageAmount}
        isEditing={true}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, coverageAmount: value ?? null }))
        }
        error={errors.coverageAmount}
        suffix="/lb"
      />

      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        onCancel={handleClose}
        isSaving={loading}
        error={error}
        saveLabel={initialData ? "Save Changes" : "Add Policy"}
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
      children={formContent}
      heightVh={95}
    />
  );
};

export default LiabilityModal;
