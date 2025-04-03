"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FieldRow from "@/app/components/shared/FieldRow";
import { ArrivalWindowSchema } from "@/types/convex-schemas";
import { ArrivalWindowFormData } from "@/types/form-types";
import { useUpdateArrivalWindow } from "../hooks/useUpdateArrivalWindow";

interface ArrivalWindowSectionProps {
  arrivalWindow: ArrivalWindowSchema;
}

const ArrivalWindowSection: React.FC<ArrivalWindowSectionProps> = ({
  arrivalWindow,
}) => {
  const {
    updateArrivalWindow,
    updateArrivalWindowLoading,
    updateArrivalWindowError,
    setUpdateArrivalWindowError,
  } = useUpdateArrivalWindow();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ArrivalWindowFormData>({
    morningArrival: arrivalWindow.morningArrival,
    morningEnd: arrivalWindow.morningEnd,
    afternoonArrival: arrivalWindow.afternoonArrival,
    afternoonEnd: arrivalWindow.afternoonEnd,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      morningArrival: arrivalWindow.morningArrival,
      morningEnd: arrivalWindow.morningEnd,
      afternoonArrival: arrivalWindow.afternoonArrival,
      afternoonEnd: arrivalWindow.afternoonEnd,
    });
    setUpdateArrivalWindowError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value) || 0,
    }));
  };

  const handleSave = async () => {
    const success = await updateArrivalWindow(arrivalWindow._id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Arrival Window"
          isEditing={isEditing}
          onEditClick={handleEditClick}
        />

        <FieldGroup>
          <FieldRow
            label="Morning Arrival (AM)"
            name="morningArrival"
            value={formData.morningArrival.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Morning End (AM)"
            name="morningEnd"
            value={formData.morningEnd.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Afternoon Arrival (PM)"
            name="afternoonArrival"
            value={formData.afternoonArrival.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <FieldRow
            label="Afternoon End (PM)"
            name="afternoonEnd"
            value={formData.afternoonEnd.toString()}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {isEditing && (
            <FormActions
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={updateArrivalWindowLoading}
              error={updateArrivalWindowError}
            />
          )}
        </FieldGroup>
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ArrivalWindowSection;
