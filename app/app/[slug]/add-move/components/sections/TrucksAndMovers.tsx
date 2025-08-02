import CounterInput from "@/app/components/shared/labeled/CounterInput";
import React, { useState } from "react";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { JobType } from "@/types/types";
import ToggleButtonGroup from "@/app/components/shared/labeled/ToggleButtonGroup";
import Header3 from "@/app/components/shared/heading/Header3";
import CurrencyInput from "@/app/components/shared/labeled/CurrencyInput";
import TruckSelector from "@/app/components/move/sections/TruckSelector";
import TagLabel from "@/app/components/shared/labeled/TagLabel";
import MoverSelector from "@/app/components/move/sections/MoveSelector";
import EditableTruckField from "@/app/components/move/sections/EditableTruckField";

interface TrucksAndMoversProps {
  isEditing?: boolean;
}

const TrucksAndMovers: React.FC<TrucksAndMoversProps> = ({
  isEditing = true,
}) => {
  const { moveFormData, setMoveFormData, moveFormErrors, setMoveFormErrors } =
    useMoveForm();
  const [tagTrucksType, setTagTrucksType] = useState<"suggested" | "custom">(
    "suggested"
  );
  const [tagMoversType, setTagMoversType] = useState<"suggested" | "custom">(
    "suggested"
  );

  const hourEstimates: Record<number, [number, number]> = {
    1: [1, 2],
    2: [2, 3],
    3: [3, 4],
    4: [4, 5],
  };

  const updateMoverAndTimes = (
    val: number,
    hourEstimates: Record<number, [number, number]>,
    prev: typeof moveFormData
  ) => {
    const estimate = hourEstimates[val];
    return {
      ...prev,
      movers: val,
      startingMoveTime: estimate?.[0] ?? prev.startingMoveTime,
      endingMoveTime: estimate?.[1] ?? prev.endingMoveTime,
    };
  };

  return (
    <SectionContainer>
      <Header3 wrapperClassName="px-0 pt-0" showCheckmark={false}>
        Labor
      </Header3>
      <EditableTruckField
        value={moveFormData.trucks}
        onChange={(val) => {
          setMoveFormData({ ...moveFormData, trucks: val });
          if (moveFormErrors.trucks) {
            const { trucks, ...rest } = moveFormErrors;
            setMoveFormErrors(rest);
          }
        }}
        tagType={tagTrucksType}
        setTagType={setTagTrucksType}
        isEditing={isEditing}
      />

      <TagLabel
        label="Movers"
        buttonText={tagMoversType === "suggested" ? "Custom" : "Suggested"}
        onToggle={() =>
          setTagMoversType(
            tagMoversType === "suggested" ? "custom" : "suggested"
          )
        }
      />
      {tagMoversType === "suggested" ? (
        <MoverSelector
          value={moveFormData.movers}
          onChange={(val) =>
            setMoveFormData(
              updateMoverAndTimes(val, hourEstimates, moveFormData)
            )
          }
          recommendedValue={2}
          warningValue={1}
          hourEstimates={hourEstimates}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <CounterInput
            label="Starting Hour"
            value={moveFormData.startingMoveTime}
            onChange={(value) => {
              setMoveFormData({ ...moveFormData, startingMoveTime: value });
              if (moveFormErrors.startingMoveTime) {
                const { startingMoveTime, ...rest } = moveFormErrors;
                setMoveFormErrors(rest);
              }
            }}
            min={1}
            max={10}
            isEditingProp={isEditing}
          />
          <CounterInput
            label="Ending Hour"
            value={moveFormData.endingMoveTime}
            onChange={(value) => {
              setMoveFormData({ ...moveFormData, endingMoveTime: value });
              if (moveFormErrors.endingMoveTime) {
                const { endingMoveTime, ...rest } = moveFormErrors;
                setMoveFormErrors(rest);
              }
            }}
            min={1}
            max={10}
            isEditingProp={isEditing}
          />
          <CounterInput
            label="Number of Movers"
            value={moveFormData.movers}
            onChange={(value) => {
              setMoveFormData({ ...moveFormData, movers: value });
              if (moveFormErrors.movers) {
                const { movers, ...rest } = moveFormErrors;
                setMoveFormErrors(rest);
              }
            }}
            min={1}
            max={10}
            isEditingProp={isEditing}
          />{" "}
        </div>
      )}

      <div className="grid grid-cols-2 mt-4"></div>

      <ToggleButtonGroup<JobType>
        label="Job Type"
        value={moveFormData.jobType}
        onChange={(value) => {
          setMoveFormData({ ...moveFormData, jobType: value });
          if (moveFormErrors.jobType) {
            const { jobType, ...rest } = moveFormErrors;
            setMoveFormErrors(rest);
          }
        }}
        options={[
          { label: "Hourly", value: "hourly" },
          { label: "Flat", value: "flat" },
        ]}
        isEditing={isEditing}
      />

      <CurrencyInput
        label={
          moveFormData.jobType === "hourly"
            ? "Hourly Rate ($/hr)"
            : "Flat Rate ($)"
        }
        value={moveFormData.jobTypeRate || 0}
        onChange={(val) => {
          setMoveFormData((prev) => ({
            ...prev,
            jobTypeRate: val ? Math.round(val * 100) / 100 : null,
          }));
          if (moveFormErrors.jobTypeRate) {
            const { jobTypeRate, ...rest } = moveFormErrors;
            setMoveFormErrors(rest);
          }
        }}
        error={moveFormErrors.jobTypeRate}
        isEditing={isEditing}
      />
    </SectionContainer>
  );
};

export default TrucksAndMovers;
