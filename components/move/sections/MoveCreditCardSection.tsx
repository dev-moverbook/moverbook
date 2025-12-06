"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import EditToggleButton from "../../shared/buttons/EditToggleButton";
import FormActions from "@/components/shared/buttons/FormActions";
import PercentageInput from "../../shared/labeled/PercentageInput";

interface MoveCreditCardFeeProps {
  isAdd?: boolean;
  isSaving?: boolean;
  updateError?: string | null;
  onSave?: () => Promise<boolean>;
  onCancel?: () => void;
  creditCardFeeRate: number;
  initialCreditCardFeeRate: number;
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
  initialCreditCardFeeRate,
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

  // --- Disabled Logic ---
  // The field must not be empty (rate is a number, so 0 is usually fine,
  // but if null/NaN is possible, check against that). Assuming rate is a number >= 0.

  const hasNoChanges = creditCardFeeRate === initialCreditCardFeeRate;

  // Disable if in editing mode and no changes were made.
  // Note: For 'isAdd', hasNoChanges is generally irrelevant, but we ensure it's
  // not disabled solely due to no changes if we're adding.
  const isDisabled =
    (isEditing && hasNoChanges) || (isAdd && creditCardFeeRate === 0); // Optionally disable if adding and rate is 0

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
            disabled={isDisabled}
          />
        )}
      </SectionContainer>
    </div>
  );
};

export default MoveCreditCardFeeSection;
