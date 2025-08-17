"use client";

import { useState } from "react";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import { TravelChargingTypes } from "@/types/enums";
import { useUpdateTravelFee } from "../hooks/useUpdateTravelFee";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import { Doc } from "@/convex/_generated/dataModel";
import {
  PAYMENT_METHOD_OPTIONS,
  TRAVEL_FEE_METHOD_OPTIONS,
} from "@/types/types";
import ButtonRadioGroup from "@/app/components/shared/labeled/ButtonRadioGroup";

interface TravelFeeSectionProps {
  travelFee: Doc<"travelFee">;
}

const TravelFeeSection: React.FC<TravelFeeSectionProps> = ({ travelFee }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Doc<"travelFee">>(travelFee);

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
            value={formData.defaultMethod ?? "None"} // 👈 show "none" if null
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
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default TravelFeeSection;
