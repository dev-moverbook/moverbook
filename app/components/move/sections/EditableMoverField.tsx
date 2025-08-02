"use client";

import React from "react";
import TagLabel from "@/app/components/shared/labeled/TagLabel";
import CounterInput from "@/app/components/shared/labeled/CounterInput";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import MoverSelector from "./MoveSelector";

interface EditableMoverFieldProps {
  movers: number;
  startingMoveTime: number | null;
  endingMoveTime: number | null;
  onChange: <K extends "movers" | "startingMoveTime" | "endingMoveTime">(
    key: K,
    value: number | null
  ) => void;
  clearError: (field: "movers" | "startingMoveTime" | "endingMoveTime") => void;
  tagType: "suggested" | "custom";
  setTagType: (val: "suggested" | "custom") => void;
  hourEstimates: Record<number, [number, number]>;
  handleMoverChangeWithEstimate: (val: number) => void;
  isEditing: boolean;
}

const EditableMoverField: React.FC<EditableMoverFieldProps> = ({
  movers,
  startingMoveTime,
  endingMoveTime,
  onChange,
  clearError,
  tagType,
  setTagType,
  hourEstimates,
  handleMoverChangeWithEstimate,
  isEditing,
}) => {
  if (!isEditing) {
    return (
      <>
        <FieldDisplay label="Movers" value={movers.toString()} fallback="N/A" />
        <FieldDisplay
          label="Labor Time"
          value={`${startingMoveTime?.toString()}-${endingMoveTime?.toString()} hours`}
          fallback="N/A"
        />
      </>
    );
  }

  return (
    <>
      <TagLabel
        label="Movers"
        buttonText={tagType === "suggested" ? "Custom" : "Suggested"}
        onToggle={() =>
          setTagType(tagType === "suggested" ? "custom" : "suggested")
        }
      />
      {tagType === "suggested" ? (
        <MoverSelector
          value={movers}
          onChange={handleMoverChangeWithEstimate}
          recommendedValue={2}
          warningValue={1}
          hourEstimates={hourEstimates}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <CounterInput
            label="Starting Hour"
            value={startingMoveTime}
            onChange={(val) => {
              onChange("startingMoveTime", val);
              clearError("startingMoveTime");
            }}
            min={1}
            max={10}
            isEditingProp={true}
          />
          <CounterInput
            label="Ending Hour"
            value={endingMoveTime}
            onChange={(val) => {
              onChange("endingMoveTime", val);
              clearError("endingMoveTime");
            }}
            min={1}
            max={10}
            isEditingProp={true}
          />
          <CounterInput
            label="Number of Movers"
            value={movers}
            onChange={(val) => {
              onChange("movers", val);
              clearError("movers");
            }}
            min={1}
            max={10}
            isEditingProp={true}
          />
        </div>
      )}
    </>
  );
};

export default EditableMoverField;
