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
import { validatePrice } from "@/app/frontendUtils/validation";

interface PolicySectionProps {
  policy: PolicySchema;
}

const PolicySection: React.FC<PolicySectionProps> = ({ policy }) => {
  const { updatePolicy, updatePolicyLoading, updatePolicyError } =
    useUpdatePolicy();
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

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

    const isNumericField = [
      "weekdayHourMinimum",
      "weekendHourMinimum",
      "deposit",
      "cancellationFee",
      "cancellationCutoffHour",
    ].includes(name);

    const parsedValue = isNumericField ? Number(value) : value;

    if (isNumericField) {
      const validationError = validatePrice(parsedValue as number);
      setErrors((prev) => ({ ...prev, [name]: validationError }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async () => {
    const weekdayError = validatePrice(formData.weekdayHourMinimum);
    const weekendError = validatePrice(formData.weekendHourMinimum);
    const depositError = validatePrice(formData.deposit);
    const cancellationFeeError = validatePrice(formData.cancellationFee);

    const newErrors = {
      weekdayHourMinimum: weekdayError,
      weekendHourMinimum: weekendError,
      deposit: depositError,
      cancellationFee: cancellationFeeError,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (hasErrors) return;

    const success = await updatePolicy(policy._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <SectionContainer isLast={true}>
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
            error={errors.weekdayHourMinimum}
            type="number"
          />

          <FieldRow
            label="Weekend Hour Minimum"
            name="weekendHourMinimum"
            value={formData.weekendHourMinimum.toString()}
            isEditing={isEditing}
            onChange={handleChange}
            error={errors.weekendHourMinimum}
            type="number"
          />

          <FieldRow
            label="Deposit"
            name="deposit"
            value={formData.deposit.toString()}
            isEditing={isEditing}
            onChange={handleChange}
            error={errors.deposit}
            type="number"
          />

          <FieldRow
            label="Cancellation Fee"
            name="cancellationFee"
            value={formData.cancellationFee.toString()}
            isEditing={isEditing}
            onChange={handleChange}
            error={errors.cancellationFee}
            type="number"
          />

          <FieldRow
            label="Cancellation Cutoff Hour"
            name="cancellationCutoffHour"
            value={formData.cancellationCutoffHour.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldTextAreaRow
            label="Bill of Landing Disclaimer and Terms"
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
