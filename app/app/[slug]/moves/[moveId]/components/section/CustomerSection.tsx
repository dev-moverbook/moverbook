"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import FormActions from "@/app/components/shared/FormActions";
import { CustomerFormData, CustomerFormErrors } from "@/types/form-types";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { cn } from "@/lib/utils";
import { validateCustomerForm } from "@/app/frontendUtils/validation";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { useUpdateMoveCustomer } from "@/app/hooks/mutations/customers/useUpdateMoveCustomer";

const CustomerSection: React.FC = () => {
  const { moveData } = useMoveContext();
  const moveCustomer = moveData.moveCustomer;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    updateMoveCustomer,
    updateMoveCustomerLoading,
    updateMoveCustomerError,
    setUpdateMoveCustomerError,
  } = useUpdateMoveCustomer();

  const [formData, setFormData] = useState<CustomerFormData>({
    name: moveCustomer.name,
    email: moveCustomer.email,
    phoneNumber: moveCustomer.phoneNumber,
    altPhoneNumber: moveCustomer.altPhoneNumber,
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});

  const removeError = (key: keyof CustomerFormErrors) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setUpdateMoveCustomerError(null);
    const { isValid, errors } = validateCustomerForm(formData);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    await updateMoveCustomer({
      moveCustomerId: moveCustomer._id,
      updates: formData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: moveCustomer.name,
      email: moveCustomer.email,
      phoneNumber: moveCustomer.phoneNumber,
      altPhoneNumber: moveCustomer.altPhoneNumber,
    });
    setIsEditing(false);
  };

  const isDisabled = formData.name.trim() === "";
  const isCompleted =
    !!formData.name?.trim() &&
    !!formData.email?.trim() &&
    !!formData.phoneNumber?.trim();

  return (
    <div>
      <SectionHeader
        title="Contact"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancel}
        className="pb-0"
        isCompleted={isCompleted}
        showCheckmark={true}
      />
      <SectionContainer className={cn("", isEditing && "gap-0")}>
        <LabeledInput
          label="Full Name"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            if (errors.name) removeError("name");
          }}
          isEditing={isEditing}
          placeholder="Enter full name"
          error={errors.name}
        />

        <LabeledInput
          label="Email"
          value={formData.email ?? ""}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) removeError("email");
          }}
          isEditing={isEditing}
          placeholder="Enter email"
          error={errors.email}
        />

        <LabeledInput
          label="Phone Number"
          value={formData.phoneNumber ?? ""}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }));
            if (errors.phoneNumber) removeError("phoneNumber");
          }}
          isEditing={isEditing}
          placeholder="Enter phone number"
          error={errors.phoneNumber}
          isPhoneNumber={true}
        />

        <LabeledInput
          label="Alternative Phone Number"
          value={formData.altPhoneNumber ?? ""}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              altPhoneNumber: e.target.value,
            }));
            if (errors.altPhoneNumber) removeError("altPhoneNumber");
          }}
          isEditing={isEditing}
          placeholder="Enter alternative phone number"
          error={errors.altPhoneNumber}
          isPhoneNumber={true}
        />
        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={updateMoveCustomerLoading}
            error={updateMoveCustomerError}
            disabled={isDisabled}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default CustomerSection;
