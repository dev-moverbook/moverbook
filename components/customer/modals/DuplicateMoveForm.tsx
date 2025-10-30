"use client";

import FieldGroup from "@/components/shared/field/FieldGroup";
import FormActions from "@/components/shared/buttons/FormActions";
import LabeledMoveCheckboxGroup from "@/components/shared/labeled/LabeledMoveCheckboxGroup";
import { Doc } from "@/convex/_generated/dataModel";
import { DuplicateOption } from "./duplicateMove.types";

interface DuplicateMoveFormProps {
  move: Doc<"moves">;
  options: DuplicateOption[];
  selectedSections: string[];
  onChangeSelected: (next: string[]) => void;
  onSwap: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitDisabled?: boolean;
}

export default function DuplicateMoveForm({
  move,
  options,
  selectedSections,
  onChangeSelected,
  onSwap,
  onSubmit,
  onCancel,
  submitDisabled,
}: DuplicateMoveFormProps) {
  return (
    <FieldGroup>
      <LabeledMoveCheckboxGroup
        label="Move Details"
        name="duplicateSections"
        values={selectedSections}
        options={options.map((option) => ({
          ...option,
          getValue: (currentMove: Doc<"moves">) => option.getValue(currentMove),
        }))}
        move={move}
        onChange={onChangeSelected}
        onSwap={onSwap}
      />
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        onCancel={onCancel}
        saveLabel="Duplicate"
        cancelLabel="Cancel"
        disabled={Boolean(submitDisabled)}
      />
    </FieldGroup>
  );
}
