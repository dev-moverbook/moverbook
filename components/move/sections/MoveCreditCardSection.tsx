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
  hideButton?: boolean;
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
  hideButton = false,
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

  const hasNoChanges = creditCardFeeRate === initialCreditCardFeeRate;

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
        hideButton={hideButton}
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
