"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import { MoveSchema } from "@/types/convex-schemas";
import FormActions from "@/app/components/shared/FormActions";
import SelectFieldRow from "@/app/components/shared/SelectFieldRow";
import { useReferralSources } from "@/app/hooks/queries/useReferralSources";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { InfoFormData } from "@/types/form-types";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { cn } from "@/lib/utils";
import {
  ContactValidationErrors,
  validateContactForm,
} from "@/app/frontendUtils/validation";

interface InfoSectionProps {
  move: MoveSchema;
}

const InfoSection = ({ move }: InfoSectionProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { options: referralOptions } = useReferralSources(move.companyId);
  const referralSelectOptions =
    referralOptions?.map((r) => ({ label: r.label, value: r.value })) ?? [];

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [formData, setFormData] = useState<InfoFormData>({
    name: move.name,
    email: move.email,
    phoneNumber: move.phoneNumber,
    altPhoneNumber: move.altPhoneNumber,
    referral: move.referral,
  });

  const [errors, setErrors] = useState<ContactValidationErrors>({});

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const referralValues = referralSelectOptions.map((r) => r.value);

    const { isValid, errors } = validateContactForm(formData, referralValues);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    await updateMove({ moveId: move._id, updates: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: move.name,
      email: move.email,
      phoneNumber: move.phoneNumber,
      altPhoneNumber: move.altPhoneNumber,
      referral: move.referral,
    });
    setIsEditing(false);
  };

  const isDisabled = formData.name.trim() === "";
  const isCompleted =
    !!formData.name?.trim() &&
    !!formData.email?.trim() &&
    !!formData.phoneNumber?.trim() &&
    !!formData.referral?.trim();

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
        {/* <FieldGroup> */}
        <LabeledInput
          label="Full Name"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }));
            setErrors((prev) => ({ ...prev, name: null }));
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
            setErrors((prev) => ({ ...prev, email: null }));
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
            setErrors((prev) => ({ ...prev, phoneNumber: null }));
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
            setErrors((prev) => ({ ...prev, altPhoneNumber: null }));
          }}
          isEditing={isEditing}
          placeholder="Enter alternative phone number"
          error={errors.altPhoneNumber}
          isPhoneNumber={true}
        />

        <SelectFieldRow
          label="Referral"
          name="referral"
          value={formData.referral}
          options={referralSelectOptions.map((o) => o.value)}
          isEditing={isEditing}
          onChange={(val) => {
            setFormData((prev) => ({ ...prev, referral: val }));
            setErrors((prev) => ({ ...prev, referral: null }));
          }}
          error={errors.referral}
        />

        {isEditing && (
          <FormActions
            onSave={(e) => {
              e.preventDefault();
              handleSave();
            }}
            onCancel={handleCancel}
            isSaving={updateMoveLoading}
            error={updateMoveError}
            disabled={isDisabled}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default InfoSection;
