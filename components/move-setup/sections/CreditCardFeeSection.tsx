"use client";

import { useState } from "react";
import SectionContainer from "@/components/shared/SectionContainer";
import CenteredContainer from "@/components/shared/CenteredContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import FormActions from "@/components/shared/FormActions";
import FieldGroup from "@/components/shared/FieldGroup";
import { useUpdateCreditCardFee } from "../hooks/useUpdateCreditCardFee";
import { Doc } from "@/convex/_generated/dataModel";
import PercentageInput from "@/components/shared/labeled/PercentageInput";

interface CreditCardFeeSectionProps {
  creditCardFee: Doc<"creditCardFees">;
}

const CreditCardFeeSection: React.FC<CreditCardFeeSectionProps> = ({
  creditCardFee,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(creditCardFee.rate);

  const {
    updateCreditCardFee,
    updateCreditCardFeeLoading,
    updateCreditCardFeeError,
    setUpdateCreditCardFeeError,
  } = useUpdateCreditCardFee();

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdateCreditCardFeeError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRate(creditCardFee.rate);
    setUpdateCreditCardFeeError(null);
  };

  const handleSave = async () => {
    const success = await updateCreditCardFee(creditCardFee._id, { rate });
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Credit Card Fee"
          isEditing={isEditing}
          onEditClick={handleEditClick}
          className="px-0 pb-4"
          onCancelEdit={handleCancel}
        />

        <FieldGroup>
          <PercentageInput
            label="Fee Rate"
            value={rate}
            onChange={(value) => {
              if (value === null) {
                setRate(0);
              } else {
                setRate(value);
              }
            }}
            isEditing={isEditing}
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={handleCancel}
              isSaving={updateCreditCardFeeLoading}
              error={updateCreditCardFeeError}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default CreditCardFeeSection;
