"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import LaborSection, {
  LaborFormData,
} from "@/app/components/move/sections/LaborSection";

const ViewLaborFee = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const roundTripDrive = move.roundTripDrive;

  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  const pickLaborData = (m: typeof move): LaborFormData => ({
    jobType: m.jobType,
    jobTypeRate: m.jobTypeRate,
    trucks: m.trucks,
    movers: m.movers ?? null,
    startingMoveTime: m.startingMoveTime ?? null,
    endingMoveTime: m.endingMoveTime ?? null,
  });

  const initialLaborData = useMemo(() => pickLaborData(move), [move]);

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
    if (result.success) setIsEditing(false);
    return result.success;
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
      roundTripDrive={roundTripDrive}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onCancel={handleCancel}
    />
  );
};

export default ViewLaborFee;
