// StackedBarChartCard.tsx
"use client";

import React, { useMemo } from "react";
import ChartCard from "../ChartCard";
import StackedBarGraphCore from "./StackedBarGraphCore";
import StackedLegendDots from "./StackedLegendDots";
import { StackedDay } from "@/types/types";
import { isStackedSeriesEmpty } from "@/convex/backendUtils/analyticsHelper";
import {
  collectSegmentNames,
  resolveColorMap,
} from "@/app/frontendUtils/graphHelpers";

type StackedBarChartCardProps = {
  title: React.ReactNode;
  series: StackedDay[];
  className?: string;
  bodyHeight?: number | string;
  emptyMessage?: string;
  headerRight?: React.ReactNode;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (isoDate: string) => string;
  colorByName?: Record<string, string>;
  footer?: React.ReactNode;
};

export default function StackedBarChartCard({
  title,
  series,
  className,
  bodyHeight = 220,
  emptyMessage = "No data",
  headerRight,
  valueFormatter,
  labelFormatter,
  colorByName,
  footer,
}: StackedBarChartCardProps) {
  const empty = isStackedSeriesEmpty(series);

  const segmentNames = useMemo(() => collectSegmentNames(series), [series]);
  const resolvedColorMap = useMemo(
    () => resolveColorMap(segmentNames, colorByName),
    [segmentNames, colorByName]
  );

  return (
    <ChartCard
      title={title}
      className={className}
      bodyHeight={bodyHeight}
      emptyMessage={emptyMessage}
      headerRight={headerRight}
      isEmpty={empty}
      footer={
        footer ?? (
          <StackedLegendDots series={series} colorByName={resolvedColorMap} />
        )
      }
    >
      {!empty && (
        <StackedBarGraphCore
          series={series}
          valueFormatter={valueFormatter}
          labelFormatter={labelFormatter}
          colorByName={resolvedColorMap}
        />
      )}
    </ChartCard>
  );
}
