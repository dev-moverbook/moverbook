"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";

import {
  defaultLabelFormatter,
  defaultValueFormatter,
  getCategoryTicksFromLabels,
  pickEvenlySpaced,
} from "./lineGraphFormatters";
import type { LineGraphDatum } from "@/types/types";
import LineGraphTooltip from "./LineGraphTooltip";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type LineGraphCoreProps = {
  data: LineGraphDatum[];
  color?: string;
  showDots?: boolean;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string | number) => string;
};

export default function LineGraphCore({
  data,
  color = "#3B82F6",
  showDots = false,
  valueFormatter = defaultValueFormatter,
  labelFormatter = defaultLabelFormatter,
}: LineGraphCoreProps) {
  const safeData = Array.isArray(data) ? data : [];
  const labels = safeData.map((d) => d.label);
  const ticks = getCategoryTicksFromLabels(labels, {
    maxWidth: 480,
    narrowCount: 3,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={safeData}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        className="outline-none focus:outline-none"
        tabIndex={-1} // not focusable
        role="img"
        aria-label="Revenue by day"
      >
        <CartesianGrid
          vertical
          horizontal={false}
          strokeDasharray="3 8"
          stroke="#FFFFFF10"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={labelFormatter}
          stroke="#9CA3AF"
          interval="preserveStartEnd"
          ticks={ticks}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={0}
          tickFormatter={valueFormatter}
          stroke="#9CA3AF"
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          dot={showDots}
        />
        <Tooltip
          cursor={{ stroke: "#FFFFFF30", strokeWidth: 1 }}
          content={(tooltipProps: TooltipProps<ValueType, NameType>) => (
            <LineGraphTooltip
              {...tooltipProps}
              valueFormatter={valueFormatter}
              labelFormatter={labelFormatter}
            />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
