"use client";

import React from "react";
import ListRow from "@/components/shared/ui/ListRow";
import ListRowContainer from "@/components/shared/containers/ListRowContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import { EnrichedMoveAssignment } from "@/types/convex-responses";
import { formatCurrency } from "@/frontendUtils/helper";
import { computeProfit, sumMoverExpense } from "@/frontendUtils/payout";
import { useMoveContext } from "@/contexts/MoveContext";

interface MoveBalanceTableProps {
  assignments: EnrichedMoveAssignment[];
}

const MoveBalanceTable: React.FC<MoveBalanceTableProps> = ({ assignments }) => {
  const { moveData } = useMoveContext();
  const { move } = moveData;

  const { invoiceAmountPaid, deposit } = move;

  if (!invoiceAmountPaid) {
    return null;
  }

  const totalRevenue = invoiceAmountPaid + deposit;
  const expense = sumMoverExpense(assignments);
  const profit = computeProfit(totalRevenue, expense);

  return (
    <div>
      <SectionHeader className="mx-auto" title="Balance" />
      <ListRowContainer>
        <ListRow
          left="Revenue"
          right={formatCurrency(totalRevenue)}
          className="bg-background2"
        />
        <ListRow left="Mover Expense" right={formatCurrency(expense)} />
        <ListRow
          bold
          left="Profit"
          right={formatCurrency(profit)}
          className="bg-background2"
        />
      </ListRowContainer>
    </div>
  );
};

export default MoveBalanceTable;
