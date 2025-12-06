"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const [formData, setFormData] = useState<PolicyFormData>({
    weekdayHourMinimum: policy.weekdayHourMinimum,
    weekendHourMinimum: policy.weekendHourMinimum,
    deposit: policy.deposit,
    cancellationFee: policy.cancellationFee,
    cancellationCutoffHour: policy.cancellationCutoffHour,
    additionalTermsAndConditions: policy.additionalTermsAndConditions ?? "",
  });

  const resetForm = useCallback(() => {
    setFormData({
      weekdayHourMinimum: policy.weekdayHourMinimum,
      weekendHourMinimum: policy.weekendHourMinimum,
      deposit: policy.deposit,
      cancellationFee: policy.cancellationFee ?? null,
      cancellationCutoffHour: policy.cancellationCutoffHour,
      additionalTermsAndConditions: policy.additionalTermsAndConditions ?? "",
    });
    setErrors({});
  }, [
    policy.weekdayHourMinimum,
    policy.weekendHourMinimum,
    policy.deposit,
    policy.cancellationFee,
    policy.cancellationCutoffHour,
    policy.additionalTermsAndConditions,
  ]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | null } }
  ) => {
    const { name, value } = "target" in e ? e.target : e;

    const numericFields = [
      "weekdayHourMinimum",
      "weekendHourMinimum",
      "deposit",
      "cancellationFee",
      "cancellationCutoffHour",
    ];

    const parsedValue = numericFields.includes(name)
      ? Number(value) || null
      : value;

    // Validate numeric fields on change
    if (numericFields.includes(name)) {
      const validationError = validatePrice(parsedValue as number);
      setErrors((prev) => ({ ...prev, [name]: validationError }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async () => {
    // Validate required numeric fields
    const fieldsToValidate = [
      "weekdayHourMinimum",
      "weekendHourMinimum",
      "deposit",
      "cancellationFee",
    ] as const;

    const newErrors: Partial<typeof errors> = {};

    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      newErrors[field] = validatePrice(value as number);
    });

    setErrors((prev) => ({
      ...prev,
      ...(newErrors as { [key: string]: string | null }),
    }));
    if (Object.values(newErrors).some((err) => err !== null)) return;

    const success = await updatePolicy(policy._id, {
      ...formData,
      deposit: formData.deposit ?? undefined,
      cancellationFee: formData.cancellationFee ?? undefined,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const hasChanges = useMemo(() => {
    return (
      formData.weekdayHourMinimum !== policy.weekdayHourMinimum ||
      formData.weekendHourMinimum !== policy.weekendHourMinimum ||
      formData.deposit !== policy.deposit ||
      formData.cancellationFee !== policy.cancellationFee ||
      formData.cancellationCutoffHour !== policy.cancellationCutoffHour ||
      formData.additionalTermsAndConditions !==
        (policy.additionalTermsAndConditions ?? "")
    );
  }, [formData, policy]);

  useEffect(() => {
    if (!isEditing) {
      resetForm();
    }
  }, [isEditing, resetForm]);

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
            unit="hrs"
          />

          <FieldTextAreaRow
            label="Additional Terms and Conditions"
            name="additionalTermsAndConditions"
            value={formData.additionalTermsAndConditions ?? ""}
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
              disabled={!hasChanges}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default PolicySection;
