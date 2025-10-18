"use client";

import { useState } from "react";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FormActions from "@/components/shared/buttons/FormActions";
import FieldGroup from "@/components/shared/field/FieldGroup";
import { PolicyFormData } from "@/types/form-types";
import { useUpdatePolicy } from "@/hooks/policies";
import FieldTextAreaRow from "@/components/shared/field/FieldTextAreaRow";
import { validatePrice } from "@/frontendUtils/validation";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";
import { Doc } from "@/convex/_generated/dataModel";
import NumberInput from "@/components/shared/labeled/NumberInput";

interface PolicySectionProps {
  policy: Doc<"policies">;
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
    additionalTermsAndConditions: policy.additionalTermsAndConditions,
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
      additionalTermsAndConditions: policy.additionalTermsAndConditions,
    });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | null } }
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

    const success = await updatePolicy(policy._id, {
      ...formData,
      deposit: formData.deposit ?? undefined,
      cancellationFee: formData.cancellationFee ?? undefined,
    });
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
          className="px-0 pb-4"
          onCancelEdit={handleCancel}
        />

        <FieldGroup>
          <NumberInput
            label="Weekday Hour Minimum"
            value={formData.weekdayHourMinimum}
            onChange={(value) =>
              handleChange({ target: { name: "weekdayHourMinimum", value } })
            }
            error={errors.weekdayHourMinimum}
            unit="hrs"
            isEditing={isEditing}
          />

          <NumberInput
            label="Weekend Hour Minimum"
            value={formData.weekendHourMinimum}
            onChange={(value) =>
              handleChange({ target: { name: "weekendHourMinimum", value } })
            }
            error={errors.weekendHourMinimum}
            unit="hrs"
            isEditing={isEditing}
          />

          <CurrencyInput
            label="Deposit"
            value={formData.deposit}
            isEditing={isEditing}
            onChange={(value) =>
              handleChange({ target: { name: "deposit", value } })
            }
            error={errors.deposit}
          />
          <CurrencyInput
            label="Cancellation Fee"
            value={formData.cancellationFee}
            isEditing={isEditing}
            onChange={(value) =>
              handleChange({ target: { name: "cancellationFee", value } })
            }
            error={errors.cancellationFee}
          />

          <NumberInput
            label="Cancellation Cutoff Hour"
            value={formData.cancellationCutoffHour}
            isEditing={isEditing}
            onChange={(value) =>
              handleChange({
                target: { name: "cancellationCutoffHour", value },
              })
            }
            error={errors.cancellationCutoffHour}
            unit="hrs"
          />

          <FieldTextAreaRow
            label="Additional Terms and Conditions"
            name="additionalTermsAndConditions"
            value={formData.additionalTermsAndConditions}
            isEditing={isEditing}
            onChange={handleChange}
            placeholder="Enter additional terms and conditions"
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
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
