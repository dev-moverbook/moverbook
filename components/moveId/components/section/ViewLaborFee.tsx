"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMoveContext } from "@/contexts/MoveContext";
import { useUpdateMove } from "@/hooks/moves";
import LaborSection, {
  LaborFormData,
} from "@/components/move/sections/LaborSection";
import { sumSegments } from "@/frontendUtils/helper";

const ViewLaborFee = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const segmentDistances = move.segmentDistances;
  const { totalMinutes } = sumSegments(segmentDistances ?? []);

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const initialLaborData = useMemo<LaborFormData>(
    () => ({
      jobType: move.jobType ?? "hourly",
      jobTypeRate: move.jobTypeRate ?? null,
      trucks: move.trucks ?? 0,
      movers: move.movers ?? null,
      startingMoveTime: move.startingMoveTime ?? null,
      endingMoveTime: move.endingMoveTime ?? null,
    }),
    [
      move.jobType,
      move.jobTypeRate,
      move.trucks,
      move.movers,
      move.startingMoveTime,
      move.endingMoveTime,
    ]
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [laborData, setLaborData] = useState<LaborFormData>(initialLaborData);

  useEffect(() => {
    setLaborData(initialLaborData);
  }, [initialLaborData]);

  const handleLaborChange = <K extends keyof LaborFormData>(
    key: K,
    value: LaborFormData[K]
  ) => {
    setLaborData((prev) => ({ ...prev, [key]: value }));
  };

  const normalizeForUpdate = (d: LaborFormData) => ({
    ...d,
    movers: d.movers ?? undefined,
    startingMoveTime: d.startingMoveTime ?? undefined,
    endingMoveTime: d.endingMoveTime ?? undefined,
  });

  const handleSave = async (): Promise<boolean> => {
    const result = await updateMove({
      moveId: move._id,
      updates: normalizeForUpdate(laborData),
    });
    if (result) {
      setIsEditing(false);
    }
    return result;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLaborData(initialLaborData);
  };

  return (
    <LaborSection
      isAdd={false}
      formData={laborData}
      onChange={handleLaborChange}
      isSaving={updateMoveLoading}
      updateError={updateMoveError}
      onSave={handleSave}
      totalDriveTime={totalMinutes}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onCancel={handleCancel}
      originalData={initialLaborData}
    />
  );
};

export default ViewLaborFee;
