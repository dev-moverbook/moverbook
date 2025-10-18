"use client";

import type { FunnelPoint, PlotMargin } from "@/types/types";

type FunnelLabelsGridProps = {
  stages: FunnelPoint[];
  plotMargin: PlotMargin;
  labelFormatter: (label: string | number) => string;
  valueFormatter: (value: number) => string;
  className?: string;
};

export default function FunnelLabelsGrid({
  stages,
  plotMargin,
  labelFormatter,
  valueFormatter,
  className,
}: FunnelLabelsGridProps) {
  const stageCount = stages.length;

  return (
    <div
      className={
        "pointer-events-none absolute top-2 left-0 right-0 z-10 grid gap-0 " +
        (className ?? "")
      }
      style={{
        gridTemplateColumns: `repeat(${stageCount}, minmax(0,1fr))`,
        paddingLeft: plotMargin.left,
        paddingRight: plotMargin.right,
      }}
    >
      {stages.map((stage) => (
        <div key={stage.status} className="min-w-0">
          <div className="text-sm text-muted-foreground">
            {labelFormatter(stage.status)}
          </div>
          <div className="text-sm font-semibold text-white">
            {valueFormatter(stage.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
