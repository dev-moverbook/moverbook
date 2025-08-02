"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import React, { useState } from "react";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import SelectFieldRow from "@/app/components/shared/SelectFieldRow";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { InternalNotesFormData } from "@/types/form-types";
import { useGetSalesReps } from "@/app/hooks/queries/useGetSalesReps";
import LabeledTextarea from "@/app/components/shared/labeled/LabeledTextarea";
import { useMoveContext } from "@/app/contexts/MoveContext";

interface InternalNotesSectionProps {}

const InternalNotesSection = ({}: InternalNotesSectionProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();
  const { users: salesReps } = useGetSalesReps(move.companyId);

  const [formData, setFormData] = useState<InternalNotesFormData>({
    notes: move.notes,
    moveStatus: move.moveStatus,
    salesRep: move.salesRep,
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
      <SectionContainer showBorder={false} className="">
        <FieldGroup>
          <LabeledTextarea
            label="Notes"
            value={formData.notes ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            isEditing={isEditing}
            placeholder="Add internal notes here"
          />

          <SelectFieldRow
            label="Sales Rep"
            name="salesRep"
            value={
              salesReps?.find((rep) => rep._id === formData.salesRep)?.name ??
              formData.salesRep
            }
            options={salesReps?.map((rep) => rep.name) ?? []}
            isEditing={isEditing}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                salesRep:
                  salesReps?.find((rep) => rep.name === val)?._id ??
                  move.salesRep,
              }))
            }
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
