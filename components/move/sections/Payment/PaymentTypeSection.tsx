"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import EditToggleButton from "@/components/shared/buttons/EditToggleButton";
import ButtonRadioGroup from "@/components/shared/labeled/ButtonRadioGroup";
import LabeledInput from "@/components/shared/labeled/LabeledInput";
import { PAYMENT_METHOD_OPTIONS, PaymentMethod } from "@/types/types";
import FormActions from "@/components/shared/buttons/FormActions";
import { arePaymentMethodsEqual } from "@/frontendUtils/validation";

type PaymentTypeSectionProps = {
  paymentMethod: PaymentMethod | null;
  originalPaymentMethod?: PaymentMethod | null;
  onChange: (pm: PaymentMethod) => void;
  isAdd?: boolean;
  isSaving?: boolean;
  updateError?: string | null;
  onSave?: () => Promise<boolean>;
  onCancel?: () => void;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  hideButton?: boolean;
};

const PaymentTypeSection: React.FC<PaymentTypeSectionProps> = ({
  paymentMethod,
  originalPaymentMethod,
  onChange,
  isAdd = false,
  isSaving = false,
  updateError,
  onSave,
  onCancel,
  isEditing = false,
  setIsEditing,
  hideButton = false,
}) => {
  const editingMode = isAdd || isEditing;

  const isFormValid = useMemo(() => {
    if (!paymentMethod) {
      return false;
    }

    if (paymentMethod.kind === "credit_card") {
      return true;
    }

    if (paymentMethod.kind === "other") {
      return paymentMethod.label.trim().length > 0;
    }

    return false;
  }, [paymentMethod]);

  const hasChanges = useMemo(() => {
    if (isAdd) {
      return true;
    }
    return !arePaymentMethodsEqual(
      paymentMethod,
      originalPaymentMethod ?? null
    );
  }, [paymentMethod, originalPaymentMethod, isAdd]);

  const canSave = editingMode && hasChanges && isFormValid;

  const displayLabel = useMemo(() => {
    if (!paymentMethod) {
      return "Not set";
    }
    return paymentMethod.kind === "other" ? paymentMethod.label : "Credit Card";
  }, [paymentMethod]);

  const selectedKind = paymentMethod?.kind ?? null;

  const handleToggle = () => {
    if (isEditing) {
      onCancel?.();
      setIsEditing?.(false);
    } else {
      setIsEditing?.(true);
    }
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }
    const success = await onSave?.();
    if (success) {
      setIsEditing?.(false);
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
        hideButton={hideButton}
      >
        Payment Type
      </Header3>

      <SectionContainer>
        {editingMode ? (
          <>
            <ButtonRadioGroup
              name="paymentMethod"
              value={selectedKind ?? "credit_card"}
              options={PAYMENT_METHOD_OPTIONS.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              onChange={(val) => {
                if (val === "credit_card") {
                  onChange({ kind: "credit_card" });
                } else if (val === "other") {
                  const existingLabel =
                    paymentMethod?.kind === "other" ? paymentMethod.label : "";
                  onChange({ kind: "other", label: existingLabel });
                }
              }}
              label="Payment Method"
              isEditing={!isSaving}
            />

            {selectedKind === "other" && (
              <div className="mt-4">
                <LabeledInput
                  label="Other Method"
                  value={
                    paymentMethod?.kind === "other" ? paymentMethod.label : ""
                  }
                  onChange={(e) =>
                    onChange({
                      kind: "other",
                      label: e.target.value,
                    })
                  }
                  placeholder="e.g., Cash, Check, Zelle"
                  isEditing={true}
                  className="transition-all"
                />
              </div>
            )}

            {editingMode && !isAdd && (
              <FormActions
                onSave={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                onCancel={() => {
                  onCancel?.();
                  setIsEditing?.(false);
                }}
                isSaving={isSaving}
                error={updateError}
                disabled={!canSave}
              />
            )}
          </>
        ) : (
          <div className="text-sm text-gray-300">
            {displayLabel || "Not set"}
          </div>
        )}
      </SectionContainer>
    </div>
  );
};

export default PaymentTypeSection;
