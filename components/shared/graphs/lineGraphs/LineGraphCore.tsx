"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
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
  DEFAULT_STROKES,
} from "./lineGraphUtils";
import LineGraphTooltip from "./LineGraphTooltip";
import type { LineSeries } from "@/types/types";
import { X_TICK_STYLE, Y_TICK_STYLE } from "@/types/const";
import {
  AREA_TOP_OPACITY,
  AREA_MID_OPACITY,
  AREA_BOTTOM_OPACITY,
  ANIM_DURATION,
  ANIM_EASING,
} from "@/frontendUtils/graphHelpers";

type LineGraphCoreProps = {
  labelFormatter?: (label: string | number) => string;
  series: LineSeries[];
  tooltipValueFormatter?: (value: number) => string;
  valueFormatter?: (value: number) => string;
};

export default function LineGraphCore({
  labelFormatter = defaultLabelFormatter,
  series,
  valueFormatter = defaultValueFormatter,
  tooltipValueFormatter,
}: LineGraphCoreProps) {
  const { rows } = mergeSeriesByLabel(series);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
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

        <defs>
          {series.map((s, i) => {
            const color =
              s.color ?? DEFAULT_STROKES[i % DEFAULT_STROKES.length];
            const id = `lineFill-${i}`;
            return (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={color}
                  stopOpacity={AREA_TOP_OPACITY}
                />
                <stop
                  offset="70%"
                  stopColor={color}
                  stopOpacity={AREA_MID_OPACITY}
                />
                <stop
                  offset="100%"
                  stopColor={color}
                  stopOpacity={AREA_BOTTOM_OPACITY}
                />
              </linearGradient>
            );
          })}
        </defs>

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
          width={50}
        />

        {series.map((lineSeries, i) => {
          const stroke =
            lineSeries.color ?? DEFAULT_STROKES[i % DEFAULT_STROKES.length];
          const fillId = `lineFill-${i}`;

          return (
            <Area
              key={lineSeries.id}
              type="monotone"
              dataKey={lineSeries.id}
              name={lineSeries.name ?? lineSeries.id}
              yAxisId="left"
              stroke={stroke} // outline (replaces <Line>)
              strokeWidth={3}
              fill={`url(#${fillId})`} // gradient fill
              connectNulls
              isAnimationActive
              animationBegin={0}
              animationDuration={ANIM_DURATION}
              animationEasing={ANIM_EASING}
            />
          );
        })}

        <Tooltip
          content={(tp) => (
            <LineGraphTooltip
              {...tp}
              valueFormatter={tooltipValueFormatter ?? valueFormatter}
            />
          )}
          cursor={{ stroke: "#FFFFFF30", strokeWidth: 1 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
