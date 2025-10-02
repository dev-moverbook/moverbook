"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  barChartMargin,
  collectSegmentNames,
  resolveColorMap,
  sundayFirst,
  toRechartsRows,
} from "@/app/frontendUtils/graphHelpers";
import { StackedDay } from "@/types/types";
import StackedBarTooltip from "./StackedBarTooltip";
import {
  defaultLabelFromIso,
  defaultValueFormat,
} from "@/convex/backendUtils/analyticsHelper";

type StackedBarGraphCoreProps = {
  series: StackedDay[];
  className?: string;
  labelFormatter?: (isoDate: string) => string;
  valueFormatter?: (value: number) => string;
  colorByName?: Record<string, string>;
  yAxisWidth?: number;
  barCategoryGap?: string | number;
};

export default function StackedBarGraphCore({
  series,
  className,
  labelFormatter = defaultLabelFromIso,
  valueFormatter = defaultValueFormat,
  colorByName,
  yAxisWidth = 0,
  barCategoryGap = "20%",
}: StackedBarGraphCoreProps) {
  const safeSeries = useMemo<StackedDay[]>(
    () => (Array.isArray(series) ? series : []),
    [series]
  );

  const weekSeries = useMemo(() => sundayFirst(safeSeries), [safeSeries]);

  const segmentNames = useMemo(
    () => collectSegmentNames(weekSeries),
    [weekSeries]
  );

  const colorMap = useMemo(
    () => resolveColorMap(segmentNames, colorByName),
    [segmentNames, colorByName]
  );

  const rechartsRows = useMemo(
    () => toRechartsRows(weekSeries, labelFormatter),
    [weekSeries, labelFormatter]
  );

  return (
    <div className={className}>
      <div className="relative h-[240px] w-full">
        <ResponsiveContainer width="100%" height="97%">
          <BarChart
            data={rechartsRows}
            margin={barChartMargin}
            barCategoryGap={barCategoryGap}
          >
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            />
            <YAxis
              hide
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.06)" }}
              content={(tooltipProps) => (
                <StackedBarTooltip
                  {...tooltipProps}
                  valueFormatter={valueFormatter}
                />
              )}
            />
            {segmentNames.map((segmentName) => (
              <Bar
                key={segmentName}
                dataKey={segmentName}
                name={segmentName}
                stackId="stack"
                fill={colorMap[segmentName]}
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
