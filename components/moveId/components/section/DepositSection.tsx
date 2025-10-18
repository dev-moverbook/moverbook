"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import React, { useState } from "react";
import FieldGroup from "@/components/shared/FieldGroup";
import FormActions from "@/components/shared/FormActions";
import { useUpdateMove } from "../../../../hooks/moves/useUpdateMove";
import { DepositFormData } from "@/types/form-types";
import { useMoveContext } from "@/contexts/MoveContext";
import CurrencyInput from "@/components/shared/labeled/CurrencyInput";

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
