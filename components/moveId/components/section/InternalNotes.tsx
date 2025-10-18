"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import React, { useState } from "react";
import FieldGroup from "@/components/shared/FieldGroup";
import FormActions from "@/components/shared/FormActions";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import SelectFieldRow from "@/components/shared/SelectFieldRow";
import { useUpdateMove } from "../../../../hooks/moves/useUpdateMove";
import { InternalNotesFormData } from "@/types/form-types";
import LabeledTextarea from "@/components/shared/labeled/LabeledTextarea";
import { useMoveContext } from "@/contexts/MoveContext";
import SalesRepSelect from "@/components/shared/select/SalesRepSelect";
import { Id } from "@/convex/_generated/dataModel";

const InternalNotesSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [formData, setFormData] = useState<InternalNotesFormData>({
    notes: move.notes,
    moveStatus: move.moveStatus,
    salesRep: move.salesRep,
  });

  const handleEditClick = () => setIsEditing(true);

  const handleSave = async () => {
    await updateMove({ moveId: move._id, updates: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      notes: move.notes,
      moveStatus: move.moveStatus,
      salesRep: move.salesRep,
    });
    setIsEditing(false);
  };

  return (
    <div>
      <SectionHeader
        title="Internal Notes"
        isEditing={isEditing}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancel}
        className="mx-auto"
      />

      <SectionContainer showBorder={false}>
        <FieldGroup>
          <LabeledTextarea
            label="Notes"
            value={formData.notes ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            isEditing={isEditing}
            placeholder="Add internal notes here"
          />

          <SalesRepSelect
            companyId={move.companyId}
            label="Sales Rep"
            valueId={formData.salesRep}
            onChangeId={(id) => {
              if (!id) {
                return;
              }
              setFormData((prev) => ({ ...prev, salesRep: id as Id<"users"> }));
            }}
            isEditing={isEditing}
            placeholder="Select a sales rep"
          />

          <SelectFieldRow
            label="Move Status"
            name="status"
            value={formData.moveStatus}
            options={MOVE_STATUS_OPTIONS.map((opt) => opt.value)}
            isEditing={isEditing}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                moveStatus: val as MoveStatus,
              }))
            }
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

export default InternalNotesSection;
