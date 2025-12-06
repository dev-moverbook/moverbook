"use client";

import { useState } from "react";
import SectionContainer from "@/components/shared/section/SectionContainer";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FormActions from "@/components/shared/buttons/FormActions";
import FieldGroup from "@/components/shared/field/FieldGroup";
import { TravelChargingTypes } from "@/types/enums";
import { useUpdateTravelFee } from "@/hooks/travelFees";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";
import { Doc } from "@/convex/_generated/dataModel";
import { TRAVEL_FEE_METHOD_OPTIONS } from "@/types/types";
import ButtonRadioGroup from "@/components/shared/labeled/ButtonRadioGroup";

interface TravelFeeSectionProps {
  travelFee: Doc<"travelFees">;
}

const TravelFeeSection: React.FC<TravelFeeSectionProps> = ({ travelFee }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Doc<"travelFees">>(travelFee);

  const {
    updateTravelFee,
    updateTravelFeeLoading,
    updateTravelFeeError,
    setUpdateTravelFeeError,
  } = useUpdateTravelFee();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(travelFee);
    setUpdateTravelFeeError(null);
  };

  const handleDefaultTravelFeeChange = (value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      defaultMethod: value === "None" ? null : (value as TravelChargingTypes),
    }));
  };

  const handleSave = async () => {
    const success = await updateTravelFee(travelFee._id, {
      mileageRate: formData.mileageRate,
      flatRate: formData.flatRate,
      defaultMethod: formData.defaultMethod ?? null,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const hasNoChanges = () => {
    return (
      formData.mileageRate === travelFee.mileageRate &&
      formData.flatRate === travelFee.flatRate &&
      (formData.defaultMethod ?? null) === (travelFee.defaultMethod ?? null)
    );
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Travel Fee"
          isEditing={isEditing}
          onEditClick={handleEditClick}
          className="px-0 pb-4"
          onCancelEdit={handleCancel}
        />

        <FieldGroup>
          <CurrencyInput
            label="Mileage Rate ($/mile)"
            value={formData.mileageRate || null}
            isEditing={isEditing}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                mileageRate: value === null ? undefined : value,
              }));
            }}
            suffix="/mile"
          />
          <CurrencyInput
            label="Flat Rate"
            value={formData.flatRate || null}
            isEditing={isEditing}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                flatRate: value === null ? undefined : value,
              }));
            }}
          />
          <ButtonRadioGroup
            name="defaultTravelFee"
            value={formData.defaultMethod ?? "None"}
            options={TRAVEL_FEE_METHOD_OPTIONS}
            onChange={handleDefaultTravelFeeChange}
            label="Default Travel Fee"
            isEditing={isEditing}
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={handleCancel}
              isSaving={updateTravelFeeLoading}
              error={updateTravelFeeError}
              disabled={hasNoChanges()}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default TravelFeeSection;
