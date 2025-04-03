"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import { PolicySchema } from "@/types/convex-schemas";
import { PolicyFormData } from "@/types/form-types";
import { useUpdatePolicy } from "../hooks/useUpdatePolicy";
import FieldTextAreaRow from "@/app/components/shared/FieldTextAreaRow";

interface PolicySectionProps {
  policy: PolicySchema;
}

const PolicySection: React.FC<PolicySectionProps> = ({ policy }) => {
  const { updatePolicy, updatePolicyLoading, updatePolicyError } =
    useUpdatePolicy();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<PolicyFormData>({
    weekdayHourMinimum: policy.weekdayHourMinimum,
    weekendHourMinimum: policy.weekendHourMinimum,
    deposit: policy.deposit,
    cancellationFee: policy.cancellationFee,
    cancellationCutoffHour: policy.cancellationCutoffHour,
    billOfLandingDisclaimerAndTerms: policy.billOfLandingDisclaimerAndTerms,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      weekdayHourMinimum: policy.weekdayHourMinimum,
      weekendHourMinimum: policy.weekendHourMinimum,
      deposit: policy.deposit,
      cancellationFee: policy.cancellationFee,
      cancellationCutoffHour: policy.cancellationCutoffHour,
      billOfLandingDisclaimerAndTerms: policy.billOfLandingDisclaimerAndTerms,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "billOfLandingDisclaimerAndTerms" ? value : Number(value),
    }));
  };

  const handleSave = async () => {
    const success = await updatePolicy(policy._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Policy Information"
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />

        <FieldGroup>
          <FieldRow
            label="Weekday Hour Minimum"
            name="weekdayHourMinimum"
            value={formData.weekdayHourMinimum.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Weekend Hour Minimum"
            name="weekendHourMinimum"
            value={formData.weekendHourMinimum.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Deposit"
            name="deposit"
            value={formData.deposit.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Cancellation Fee"
            name="cancellationFee"
            value={formData.cancellationFee.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Cancellation Cutoff Hour"
            name="cancellationCutoffHour"
            value={formData.cancellationCutoffHour.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldTextAreaRow
            label="Bill of Lading Disclaimer and Terms"
            name="billOfLandingDisclaimerAndTerms"
            value={formData.billOfLandingDisclaimerAndTerms}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {isEditing && (
            <FormActions
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={updatePolicyLoading}
              error={updatePolicyError}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default PolicySection;
