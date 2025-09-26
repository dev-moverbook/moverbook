"use client";

import type { LineGraphDatum } from "@/types/types";

const LineGraphTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string | number;
  valueFormatter: (value: number) => string;
  labelFormatter: (label: string | number) => string;
}) => {
  if (!active || !payload?.length) {
    return null;
  }
  const point: LineGraphDatum | undefined = payload[0]?.payload;
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
