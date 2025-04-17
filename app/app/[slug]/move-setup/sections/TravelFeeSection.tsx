"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TravelChargingTypes } from "@/types/enums";
import { TravelFeeSchema } from "@/types/convex-schemas";
import { TravelFeeFormData } from "@/types/form-types";
import { useUpdateTravelFee } from "../hooks/useUpdateTravelFee";
import ChargingMethodField from "@/app/components/shared/ChargingMethodField";
import DefaultCheckboxField from "@/app/components/shared/DefaultCheckboxField";
import { Badge } from "@/components/ui/badge";

interface TravelFeeSectionProps {
  travelFee: TravelFeeSchema;
}

const TravelFeeSection: React.FC<TravelFeeSectionProps> = ({ travelFee }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TravelFeeFormData>(travelFee);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: checked,
    }));
  };

  const handleChargingMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      chargingMethod: value as TravelChargingTypes,
    }));
  };

  const handleSave = async () => {
    const success = await updateTravelFee(travelFee._id, {
      isDefault: formData.isDefault,
      chargingMethod: formData.chargingMethod,
      rate: formData.rate,
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
        />

        <FieldGroup>
          <div className="flex items-start gap-2">
            <ChargingMethodField
              value={formData.chargingMethod}
              isEditing={isEditing}
              onChange={handleChargingMethodChange}
            />

            {!isEditing && formData.isDefault && (
              <Badge variant="outline" className="text-xs -mt-[2px]">
                Default
              </Badge>
            )}
          </div>

          {/* Rate */}
          <FieldRow
            label="Rate"
            name="rate"
            value={formData.rate?.toString() || ""}
            isEditing={isEditing}
            onChange={handleInputChange}
            type="number"
          />

          {isEditing && (
            <DefaultCheckboxField
              checked={formData.isDefault}
              onChange={handleCheckboxChange}
              label="Is Default"
            />
          )}

          {isEditing && (
            <FormActions
              onSave={handleSave}
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
