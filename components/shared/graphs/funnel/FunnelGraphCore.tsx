"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { FunnelPoint } from "@/types/types";
import FunnelGraphTooltip from "./FunnelGraphTooltip";
import FunnelLabelsGrid from "./FunnelLabelsGrid";
import {
  plotMarginFunnel,
  strokeTealFunnel,
  bandColorsFunnel,
} from "@/types/const";

type FunnelGraphCoreProps = {
  series: FunnelPoint[];
  className?: string;
  labelFormatter?: (label: string | number) => string;
  valueFormatter?: (value: number) => string;
};

export default function FunnelGraphCore({
  series,
  className,
  labelFormatter = (labelValue) => String(labelValue),
  valueFormatter = (numericValue) => numericValue.toLocaleString(),
}: FunnelGraphCoreProps) {
  const stages = useMemo<FunnelPoint[]>(
    () => (Array.isArray(series) ? series : []),
    [series]
  );
  const stageCount = stages.length;

  const chartData = stages.map((stage, stageIndex) => ({
    index: stageIndex,
    value: stage.value,
    status: stage.status,
  }));

  const maximumValue = Math.max(1, ...stages.map((stage) => stage.value));

  return (
    <div className={className}>
      <div className="relative h-[210px] w-full">
        <FunnelLabelsGrid
          stages={stages}
          plotMargin={plotMarginFunnel}
          labelFormatter={labelFormatter}
          valueFormatter={valueFormatter}
        />

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={plotMarginFunnel}
            tabIndex={-1}
            role="img"
            aria-label="Funnel"
          >
            {stages.map((_, stageIndex) => (
              <ReferenceArea
                key={`bg-${stageIndex}`}
                x1={stageIndex}
                x2={stageIndex + 1}
                y1={0}
                y2="auto"
                ifOverflow="hidden"
                fill={bandColorsFunnel[stageIndex % bandColorsFunnel.length]}
              />
            ))}

            {stages.map((_, stageIndex) =>
              stageIndex === 0 ? null : (
                <ReferenceLine
                  key={`sep-${stageIndex}`}
                  x={stageIndex}
                  stroke="rgba(255,255,255,0.12)"
                />
              )
            )}

            <XAxis
              type="number"
              dataKey="index"
              domain={[0, stageCount - 1]}
              hide
            />
            <YAxis type="number" domain={[0, maximumValue]} hide />

            <defs>
              <linearGradient id="funnelAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={strokeTealFunnel}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={strokeTealFunnel}
                  stopOpacity={0.06}
                />
              </linearGradient>
            </defs>

            <Tooltip content={<FunnelGraphTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeTealFunnel}
              strokeWidth={2}
              fill="url(#funnelAreaFill)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
