"use client";

import React from "react";
import type { LineGraphDatum } from "@/types/types";

export type ChartTooltipProps<
  TValue = number | string | (number | string)[],
  TName = string | number,
> = {
  active?: boolean;
  label?: string | number;
  payload?: Array<{
    value: TValue;
    name: TName;
    dataKey?: string | number;
    color?: string;
    payload: LineGraphDatum;
  }>;
};

type Props = ChartTooltipProps & {
  valueFormatter: (value: number) => string;
  labelFormatter: (label: string | number) => string;
};

const LineGraphTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}: Props) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload as LineGraphDatum | undefined;
  if (!point) {
    return null;
  }

  return (
    <div className="rounded-xl bg-neutral-900/90 px-3 py-2 text-xs text-white shadow-xl ring-1 ring-white/10">
      <div className="font-medium opacity-90">
        {labelFormatter(label ?? "")}
      </div>
      <div className="mt-1 text-sm font-semibold">
        {valueFormatter(point.value)}
      </div>
      {typeof point.count === "number" && (
        <div className="opacity-70">n = {point.count}</div>
      )}
    </div>
  );
};

export default LineGraphTooltip;
