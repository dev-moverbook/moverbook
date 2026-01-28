"use client";

import { useState, useEffect } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import FieldGroup from "@/components/shared/field/FieldGroup";
import FormActions from "@/components/shared/buttons/FormActions";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import { useUpdateMove } from "@/hooks/moves";
import { useMoveContext } from "@/contexts/MoveContext";
import SalesRepSelect from "@/components/shared/select/SalesRepSelect";
import AdaptiveSelect from "@/components/shared/select/AdaptiveSelect";
import AdaptiveContainer from "@/components/shared/select/AdaptiveContainer";
import { Label } from "@/components/ui/label";
import LabeledTextarea from "@/components/shared/labeled/LabeledTextarea";
import { isMoveCompleted } from "@/frontendUtils/moveHelper";

const InternalNotesSection = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [localNotes, setLocalNotes] = useState<string>(move.notes ?? "");

  useEffect(() => {
    if (!isEditing) {
      setLocalNotes(move.notes ?? "");
    }
  }, [move.notes, isEditing]);

  const handleImmediateUpdate = async (
    updates: Parameters<typeof updateMove>[0]["updates"]
  ) => {
    await updateMove({ moveId: move._id, updates });
  };

  const handleSaveNotes = async () => {
    await updateMove({ moveId: move._id, updates: { notes: localNotes } });
    setIsEditing(false);
  };

  const handleCancelNotes = () => {
    setLocalNotes(move.notes ?? "");
    setIsEditing(false);
  };

  const statusOptions = MOVE_STATUS_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  const notesChanged = localNotes !== (move.notes ?? "");

  const disabled = isMoveCompleted(move) || updateMoveLoading;

  return (
    <div className="pt-4">
      <SectionHeader
        title="Internal Notes"
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
        onCancelEdit={handleCancelNotes}
        className="mx-auto"
      />

      <SectionContainer showBorder={false}>
        <FieldGroup>
          <div className="space-y-2">
            <LabeledTextarea
              label="Notes"
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              isEditing={isEditing}
              placeholder="Add internal notes here"
            />

            {isEditing && (
              <FormActions
                onSave={(e) => {
                  e.preventDefault();
                  handleSaveNotes();
                }}
                onCancel={handleCancelNotes}
                isSaving={updateMoveLoading}
                error={updateMoveError}
                disabled={!notesChanged}
              />
            )}
          </div>

          <SalesRepSelect
            companyId={move.companyId}
            valueId={move.salesRep ?? null}
            onChange={(id) => handleImmediateUpdate({ salesRep: id })}
            disabled={disabled}
          />

          <AdaptiveContainer>
            <Label>Move Status</Label>
            <AdaptiveSelect
              title="Change Status"
              options={statusOptions}
              value={move.moveStatus}
              onChange={(val) =>
                handleImmediateUpdate({ moveStatus: val as MoveStatus })
              }
              placeholder="Select Status"
              triggerLabel="Status"
              description="Select the status of the move."
              showAllOption={false}
            />
          </AdaptiveContainer>
        </FieldGroup>
      </SectionContainer>
    </div>
  );
};

export default InternalNotesSection;
