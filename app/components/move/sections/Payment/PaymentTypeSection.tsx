// PaymentTypeSection.tsx
"use client";

import React, { useMemo } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import EditToggleButton from "@/app/components/shared/buttons/EditToggleButton";
import ButtonRadioGroup from "@/app/components/shared/labeled/ButtonRadioGroup";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import { PAYMENT_METHOD_OPTIONS, PaymentMethod } from "@/types/types";
import FormActions from "@/app/components/shared/FormActions";

type PaymentTypeSectionProps = {
  paymentMethod: PaymentMethod | null;
  onChange: (pm: PaymentMethod) => void;
  isAdd?: boolean;
  isSaving?: boolean;
  updateError?: string | null;
  onSave?: () => Promise<boolean>;
  onCancel?: () => void;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
};

const PaymentTypeSection: React.FC<PaymentTypeSectionProps> = ({
  paymentMethod,
  onChange,
  isAdd = false,
  isSaving = false,
  updateError,
  onSave,
  onCancel,
  isEditing = false,
  setIsEditing,
}) => {
  const displayLabel = useMemo(
    () =>
      paymentMethod?.kind === "other" ? paymentMethod.label : "Credit Card",
    [paymentMethod]
  );

  const selectedKind = paymentMethod?.kind ?? null;
  const editingMode = isAdd || isEditing;

  const handleSave = async () => {
    const success = await onSave?.();
    if (success) {
      setIsEditing?.(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleToggle = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing?.(true);
    }
  };

  return (
    <div>
      <Header3
        showCheckmark={false}
        button={
          !isAdd && (
            <EditToggleButton isEditing={isEditing} onToggle={handleToggle} />
          )
        }
      >
        Payment Type
      </Header3>

      <SectionContainer>
        {editingMode ? (
          <>
            <ButtonRadioGroup
              name="paymentMethod"
              value={selectedKind}
              options={PAYMENT_METHOD_OPTIONS.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              onChange={(val) => {
                if (val === "credit_card") {
                  onChange({ kind: "credit_card" });
                } else if (val === "other") {
                  onChange({
                    kind: "other",
                    label:
                      paymentMethod?.kind === "other"
                        ? paymentMethod.label
                        : "",
                  });
                }
              }}
              label="Payment Method"
              isEditing={!isSaving}
            />

            {selectedKind === "other" && (
              <div className="">
                <LabeledInput
                  label="Other Method"
                  value={
                    paymentMethod?.kind === "other" ? paymentMethod.label : ""
                  }
                  onChange={(e) =>
                    onChange({ kind: "other", label: e.target.value })
                  }
                  placeholder="e.g., Cash, Check, Zelle"
                  isEditing={true}
                />
              </div>
            )}

            {isEditing && (
              <FormActions
                onSave={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                onCancel={handleCancel}
                isSaving={isSaving}
                error={updateError}
              />
            )}
          </>
        ) : (
          <div className="text-sm text-white">{displayLabel}</div>
        )}
      </SectionContainer>
    </div>
  );
};

export default PaymentTypeSection;
