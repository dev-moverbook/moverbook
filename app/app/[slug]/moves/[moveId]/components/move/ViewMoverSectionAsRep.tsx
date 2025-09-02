"use client";

import React from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import StartMoveSection from "@/app/components/move/movers/StartMoveSection";
import { useSlugContext } from "@/app/contexts/SlugContext";
import ArriveOriginSection from "@/app/components/move/movers/ArriveOriginSection";
import EndMoveSection from "@/app/components/move/movers/EndMoveSectiont";
import BreakMoveSection from "@/app/components/move/movers/BreakMoveSection";

const ViewMoverSectionAsRep = () => {
  const { moveData } = useMoveContext();
  const { move } = moveData;
  const {
    _id: moveId,
    actualStartTime,
    actualArrivalTime,
    actualEndTime,
    actualBreakTime,
  } = move;

  const { timeZone } = useSlugContext();
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const handleStartMove = async () => {
    await updateMove({
      moveId,
      updates: { actualStartTime: Date.now() },
    });
  };

  const handleArriveOrigin = async () => {
    await updateMove({
      moveId,
      updates: { actualArrivalTime: Date.now() },
    });
  };

  const handleEndMove = async () => {
    await updateMove({
      moveId,
      updates: { actualEndTime: Date.now() },
    });
  };

  const handleChangeBreakTime = async (breakTime: number) => {
    await updateMove({
      moveId,
      updates: { actualBreakTime: breakTime },
    });
  };

  const handleSetStartTime = async (millis: number) => {
    await updateMove({
      moveId,
      updates: { actualStartTime: millis },
    });
  };

  const handleSetArriveOrigin = async (millis: number) => {
    await updateMove({
      moveId,
      updates: { actualArrivalTime: millis },
    });
  };

  const handleSetEndMove = async (millis: number) => {
    await updateMove({
      moveId,
      updates: { actualEndTime: millis },
    });
  };

  return (
    <>
      <StartMoveSection
        isSaving={updateMoveLoading}
        updateError={updateMoveError}
        handleStartMove={handleStartMove}
        timeZone={timeZone}
        startTime={actualStartTime}
        handleSetStartTime={handleSetStartTime}
      />

      {actualStartTime && (
        <ArriveOriginSection
          isSaving={updateMoveLoading}
          updateError={updateMoveError}
          handleArriveOrigin={handleArriveOrigin}
          timeZone={timeZone}
          arriveOriginTime={actualArrivalTime}
          handleSetArriveOrigin={handleSetArriveOrigin}
        />
      )}

      {actualArrivalTime && (
        <EndMoveSection
          isSaving={updateMoveLoading}
          updateError={updateMoveError}
          handleEndMove={handleEndMove}
          timeZone={timeZone}
          endMoveTime={actualEndTime}
          handleSetEndMove={handleSetEndMove}
        />
      )}

      {actualEndTime && (
        <BreakMoveSection
          isSaving={updateMoveLoading}
          updateError={updateMoveError}
          handleChangeBreakTime={handleChangeBreakTime}
          breakMoveTime={actualBreakTime}
        />
      )}
    </>
  );
};

export default ViewMoverSectionAsRep;
