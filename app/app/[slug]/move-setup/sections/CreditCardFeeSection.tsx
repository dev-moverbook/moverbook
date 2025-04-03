"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import { CreditCardFeeSchema } from "@/types/convex-schemas";
import { useUpdateCreditCardFee } from "../hooks/useUpdateCreditCardFee";

interface CreditCardFeeSectionProps {
  creditCardFee: CreditCardFeeSchema;
}

const CreditCardFeeSection: React.FC<CreditCardFeeSectionProps> = ({
  creditCardFee,
}) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setRate(value);
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
        />

        <FieldGroup>
          <FieldRow
            label="Fee Rate (%)"
            name="rate"
            value={rate.toString()}
            isEditing={isEditing}
            onChange={handleChange}
            type="number"
          />

          {isEditing && (
            <FormActions
              onSave={handleSave}
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
