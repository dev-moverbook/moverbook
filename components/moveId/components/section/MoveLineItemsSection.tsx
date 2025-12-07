"use client";

import { useUpdateMove } from "@/hooks/moves";
import { useCompanyFees } from "@/hooks/fees";
import { MoveFeeInput } from "@/types/form-types";
import { useMoveContext } from "@/contexts/MoveContext";
import LineItemsSection from "@/components/move/sections/LineItemSection";

const MoveLineItemsSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const { updateMove, updateMoveError, updateMoveLoading } = useUpdateMove();

  const companyFees = useCompanyFees(move.companyId);

  const handleAddMoveFee = (fee: MoveFeeInput) => {
    updateMove({
      moveId: move._id,
      updates: { moveFees: [...(move.moveFees ?? []), fee] },
    });
  };

  const handleUpdateMoveFee = (index: number, fee: MoveFeeInput) => {
    updateMove({
      moveId: move._id,
      updates: {
        moveFees: move.moveFees?.map((f, i) => (i === index ? fee : f)) ?? [],
      },
    });
  };

  const handleDeleteMoveFee = (index: number) => {
    updateMove({
      moveId: move._id,
      updates: {
        moveFees: move.moveFees?.filter((f, i) => i !== index) ?? [],
      },
    });
  };

  return (
    <LineItemsSection
      fees={move.moveFees ?? []}
      onAdd={handleAddMoveFee}
      onUpdate={handleUpdateMoveFee}
      onDelete={handleDeleteMoveFee}
      moveFeeOptions={companyFees ?? []}
      isLoading={updateMoveLoading}
      errorMessage={updateMoveError}
    />
  );
};

export default MoveLineItemsSection;
