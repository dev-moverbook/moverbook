"use client";

import { useState } from "react";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FormActions from "@/app/components/shared/FormActions";
import FieldGroup from "@/app/components/shared/FieldGroup";
import { ArrivalWindowSchema } from "@/types/convex-schemas";
import { ArrivalWindowFormData } from "@/types/form-types";
import { useUpdateArrivalWindow } from "../hooks/useUpdateArrivalWindow";
import TimeRangeFieldRow from "@/app/components/shared/TimeFieldRow";

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
      [e.target.name]: e.target.value,
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
          <TimeRangeFieldRow
            label="Morning Window"
            startName="morningArrival"
            endName="morningEnd"
            startValue={formData.morningArrival}
            endValue={formData.morningEnd}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <TimeRangeFieldRow
            label="Afternoon Window"
            startName="afternoonArrival"
            endName="afternoonEnd"
            startValue={formData.afternoonArrival}
            endValue={formData.afternoonEnd}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
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
