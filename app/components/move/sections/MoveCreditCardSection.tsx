"use client";

import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "../../shared/FormActions";
import PercentageInput from "../../shared/labeled/PercentageInput";

interface MoveCreditCardFeeProps {
  isAdd?: boolean;
  isSaving?: boolean;
  updateError?: string | null;
  onSave?: () => Promise<boolean>;
  onCancel?: () => void;
  creditCardFeeRate: number;
  handleCreditCardFeeRateChange: (value: number) => void;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

const MoveCreditCardFeeSection: React.FC<MoveCreditCardFeeProps> = ({
  isAdd = false,
  isSaving = false,
  updateError,
  onSave,
  onCancel,
  creditCardFeeRate,
  handleCreditCardFeeRateChange,
  isEditing = false,
  setIsEditing,
}) => {
  const editingMode = isAdd || isEditing;

  const handleToggle = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing?.(true);
    }
  };

  const handleSave = async () => {
    const success = await onSave?.();
    if (success) {
      setIsEditing?.(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
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
        Credit Card Fee
      </Header3>

      <SectionContainer>
        <PercentageInput
          label="Fee"
          value={creditCardFeeRate}
          onChange={handleCreditCardFeeRateChange}
          isEditing={editingMode}
        />

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
      </SectionContainer>
    </div>
  );
};

export default MoveCreditCardFeeSection;
