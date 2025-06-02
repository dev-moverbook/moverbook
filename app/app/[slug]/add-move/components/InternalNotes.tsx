import React from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header4 from "@/app/components/shared/heading/Header4";
import LabeledTextarea from "@/app/components/shared/labeled/LabeledTextarea";
import LabeledSelect from "@/app/components/shared/labeled/LabeledSelect";
import { MOVE_STATUS_OPTIONS, MoveStatus } from "@/types/types";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { Id } from "@/convex/_generated/dataModel";

const InternalNotes = () => {
  const {
    moveRep,
    setMoveRep,
    moveRepOptions,
    moveStatus,
    setMoveStatus,
    notes,
    setNotes,
  } = useMoveForm();
  return (
    <SectionContainer>
      <Header4>Internal Notes</Header4>
      <LabeledSelect
        label="Move Rep"
        value={moveRep ?? ""}
        options={moveRepOptions}
        onChange={(value) => setMoveRep(value as Id<"users">)}
      />
      <LabeledSelect
        label="Move Status"
        value={moveStatus}
        options={MOVE_STATUS_OPTIONS}
        onChange={(value) => setMoveStatus(value as MoveStatus)}
      />
      <LabeledTextarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add internal notes"
      />
    </SectionContainer>
  );
};

export default InternalNotes;
