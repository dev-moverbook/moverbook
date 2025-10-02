"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  defaultLabelFormatter,
  defaultValueFormatter,
  makeYAxisTickFormatter,
  mergeSeriesByLabel,
} from "./lineGraphUtils";
import LineGraphTooltip from "./LineGraphTooltip";
import type { LineSeries } from "@/types/types";
import { DEFAULT_STROKES } from "./lineGraphUtils";
import { X_TICK_STYLE, Y_TICK_STYLE } from "@/types/const";

type LineGraphCoreProps = {
  labelFormatter?: (label: string | number) => string;
  series: LineSeries[];
  showDotsDefault?: boolean;
  tooltipValueFormatter?: (value: number) => string;
  valueFormatter?: (value: number) => string;
};

export default function LineGraphCore({
  labelFormatter = defaultLabelFormatter,
  series,
  showDotsDefault = false,
  valueFormatter = defaultValueFormatter,
  tooltipValueFormatter,
}: LineGraphCoreProps) {
  const { rows } = mergeSeriesByLabel(series);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        aria-hidden
        aria-label="Line graph"
        className="outline-none focus:outline-none"
        data={rows}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        tabIndex={0}
      >
        <CartesianGrid
          horizontal={false}
          stroke="#FFFFFF10"
          strokeDasharray="3 8"
          vertical
        />

        <XAxis
          axisLine={false}
          dataKey="label"
          interval="preserveStartEnd"
          minTickGap={28}
          stroke="#9CA3AF"
          tickFormatter={labelFormatter}
          tickLine={false}
          tickMargin={8}
          tick={X_TICK_STYLE}
        />

        <YAxis
          axisLine={false}
          stroke="#9CA3AF"
          tickFormatter={makeYAxisTickFormatter(valueFormatter, {
            hideFirstZero: true,
          })}
          tickLine={false}
          tick={Y_TICK_STYLE}
          yAxisId="left"
          width={50} // reduce width so it hugs the labels
        />
        {series.map((lineSeries, seriesIndex) => (
          <Line
            key={lineSeries.id}
            connectNulls
            dataKey={lineSeries.id}
            dot={lineSeries.showDots ?? showDotsDefault}
            name={lineSeries.name ?? lineSeries.id}
            stroke={
              lineSeries.color ??
              DEFAULT_STROKES[seriesIndex % DEFAULT_STROKES.length]
            }
            strokeDasharray={lineSeries.strokeDasharray}
            strokeWidth={3}
            type="monotone"
            yAxisId="left"
          />
        ))}

        <Tooltip
          content={(tp) => (
            <LineGraphTooltip
              {...tp}
              labelFormatter={labelFormatter}
              valueFormatter={tooltipValueFormatter ?? valueFormatter}
            />
          )}
          cursor={{ stroke: "#FFFFFF30", strokeWidth: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
