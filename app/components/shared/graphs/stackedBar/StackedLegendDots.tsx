"use client";

import React, { useMemo } from "react";
import { StackedDay } from "@/types/types";

type StackedLegendDotsProps = {
  series: StackedDay[];
  colorByName?: Record<string, string>;
  className?: string;
};

export default function StackedLegendDots({
  series,
  colorByName,
  className,
}: StackedLegendDotsProps) {
  const segmentNames = useMemo(() => {
    const uniqueNames = new Set<string>();
    for (const day of series) {
      for (const segment of day.segments) {
        uniqueNames.add(segment.name);
      }
    }
    return Array.from(uniqueNames).sort((left, right) =>
      left.localeCompare(right)
    );
  }, [series]);

  return (
    <div
      className={
        className ?? " flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80"
      }
    >
      {segmentNames.map((segmentName) => (
        <div key={segmentName} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: colorByName?.[segmentName] }}
          />
          <span>{segmentName}</span>
        </div>
      ))}
    </div>
  );
}
