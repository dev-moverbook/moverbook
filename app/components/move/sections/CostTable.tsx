"use client";

import React from "react";
import ListRow from "@/app/components/shared/ui/ListRow";
import ListRowContainer from "@/app/components/shared/containers/ListRowContainer";
import clsx from "clsx";
import SectionHeader from "../../shared/SectionHeader";
import { ListRowType } from "@/app/frontendUtils/helper";

interface CostTableProps {
  title: string;
  rows: ListRowType[];
  formatCurrencyValues?: boolean;
  className?: string;
}

const CostTable: React.FC<CostTableProps> = ({
  title,
  rows,
  formatCurrencyValues = false,
  className,
}) => {
  if (rows.length === 0) return null;

  return (
    <div className={className}>
      <SectionHeader className="mx-auto" title={title} />
      {rows.length > 0 && (
        <ListRowContainer>
          {rows.map((row, i) => (
            <ListRow
              key={i}
              left={row.left}
              right={
                row.right === undefined || row.right === null
                  ? ""
                  : formatCurrencyValues
                    ? `$${Number(row.right).toFixed(2)}`
                    : row.right
              }
              className={clsx(
                i === 0 && "border-t border-grayCustom",
                i % 2 === 0 && "bg-background2" // background on odd rows (1-based index)
              )}
            />
          ))}
        </ListRowContainer>
      )}
    </div>
  );
};

export default CostTable;
