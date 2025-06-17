"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import { MoveSchema } from "@/types/convex-schemas";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { DepositFormData } from "@/types/form-types";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";

interface DepositSectionProps {
  move: MoveSchema;
}

const DepositSection = ({ move }: DepositSectionProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [formData, setFormData] = useState<DepositFormData>({
    deposit: move.deposit,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateMove({ moveId: move._id, updates: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      deposit: move.deposit,
    });
    setIsEditing(false);
  };

  return (
    <div>
      <SectionHeader
        title="Deposit"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancel}
      />
      <SectionContainer>
        <FieldGroup>
          <LabeledInput
            label="Deposit"
            value={formData.deposit?.toString() ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deposit: parseFloat(e.target.value),
              }))
            }
            isEditing={isEditing}
            type="number"
          />

          {isEditing && (
            <FormActions
              onSave={(e) => {
                e.preventDefault();
                handleSave();
              }}
              onCancel={handleCancel}
              isSaving={updateMoveLoading}
              error={updateMoveError}
            />
          )}
        </FieldGroup>
      </SectionContainer>
    </div>
  );
};

export default DepositSection;
