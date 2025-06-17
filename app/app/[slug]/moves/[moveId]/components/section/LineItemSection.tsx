"use client";

import { MoveSchema } from "@/types/convex-schemas";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyFees } from "@/app/hooks/queries/useCompanyFees";
import LineItems from "@/app/app/[slug]/add-move/components/sections/LineItems";
import { MoveFeeInput } from "@/types/form-types";

interface LineItemSectionProps {
  move: MoveSchema;
}

const LineItemSection = ({ move }: LineItemSectionProps) => {
  const { updateMove, updateMoveError, updateMoveLoading } = useUpdateMove();

  const { data: companyFees } = useCompanyFees(move.companyId);

  const handleAddMoveFee = (fee: MoveFeeInput) => {
    updateMove({
      moveId: move._id,
      updates: { moveFees: [...move.moveFees, fee] },
    });
  };

  const handleUpdateMoveFee = (index: number, fee: MoveFeeInput) => {
    updateMove({
      moveId: move._id,
      updates: {
        moveFees: move.moveFees.map((f, i) => (i === index ? fee : f)),
      },
    });
  };

  const handleDeleteMoveFee = (index: number) => {
    updateMove({
      moveId: move._id,
      updates: { moveFees: move.moveFees.filter((_, i) => i !== index) },
    });
  };

  return (
    <LineItems
      moveFees={move.moveFees}
      addMoveFee={handleAddMoveFee}
      updateMoveFee={handleUpdateMoveFee}
      deleteMoveFee={handleDeleteMoveFee}
      moveFeeOptions={companyFees?.fees}
      isLoading={updateMoveLoading}
      errorMessage={updateMoveError}
    />
  );
};

export default LineItemSection;
