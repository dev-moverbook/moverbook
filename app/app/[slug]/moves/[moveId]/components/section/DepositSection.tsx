"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { DepositFormData } from "@/types/form-types";
import { useMoveContext } from "@/app/contexts/MoveContext";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";

const DepositSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
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
        className="mx-auto"
      />
      <SectionContainer>
        <FieldGroup>
          <CurrencyInput
            label="Deposit"
            value={formData.deposit}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, deposit: value ?? 0 }))
            }
            isEditing={isEditing}
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
