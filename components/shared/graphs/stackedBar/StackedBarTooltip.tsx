"use client";

import React from "react";
import { RechartsTooltipProps, TooltipRowPayload } from "@/types/types";
import {
  buildTooltipRows,
  defaultValueFormat,
} from "@/convex/backendUtils/analyticsHelper";
import { formatWeekdayShortWithDate } from "@/frontendUtils/luxonUtils";
import TooltipContainer from "../container/TooltipContainer";

export default function StackedBarTooltip(
  props: RechartsTooltipProps & { valueFormatter?: (value: number) => string }
) {
  const { active, label, payload, valueFormatter } = props;
  if (!active) {
    return null;
  }

  const rows = buildTooltipRows(payload);
  if (rows.length === 0) {
    return null;
  }

  const isoDateString: string | undefined = Array.isArray(payload)
    ? (payload[0] as TooltipRowPayload)?.payload?.date
    : undefined;

  const headerLabel: string =
    typeof isoDateString === "string"
      ? formatWeekdayShortWithDate(isoDateString)
      : String(label);

  const totalValue = rows.reduce(
    (runningTotal, row) => runningTotal + row.value,
    0
  );

  const rowsToRender = rows.filter((row) => Math.abs(row.value) > 0);

  return (
    <TooltipContainer>
      <div className="mb-1 font-medium">{headerLabel}</div>

      {rowsToRender.map((row) => (
        <div key={row.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: row.color }}
          />
          <span className="opacity-80">{row.name}</span>
          <span className="ml-auto font-semibold">
            {valueFormatter
              ? valueFormatter(row.value)
              : defaultValueFormat(row.value)}
          </span>
        </div>
      ))}

      <div className="mt-1 border-t border-white/10 pt-1">
        <span className="opacity-80">Total</span>
        <span className="ml-2 font-semibold">
          {valueFormatter
            ? valueFormatter(totalValue)
            : defaultValueFormat(totalValue)}
        </span>
      </div>
    </TooltipContainer>
  );
}
