"use client";

import React from "react";
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

type Props = {
  series: FunnelPoint[];
  className?: string;
  labelFormatter?: (label: string | number) => string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showDotsDefault?: boolean;
};

export default function FunnelGraphCore({
  series,
  className,
  labelFormatter = (l) => String(l),
  valueFormatter = (v) => v.toLocaleString(),
}: Props) {
  const stages = Array.isArray(series) ? series : [];
  const count = stages.length;
  const data = stages.map((s, i) => ({
    idx: i,
    value: s.value,
    status: s.status,
  }));
  const maxValue = Math.max(1, ...stages.map((s) => s.value));

  const PLOT_MARGIN = { top: 54, right: 0, left: 0, bottom: 0 };

  // TEAL palette (rgb(20,184,166))
  const strokeTeal = "rgb(20,184,166)";
  const bands = [
    "rgb(20 184 166 / 0.28)",
    "rgb(20 184 166 / 0.22)",
    "rgb(20 184 166 / 0.16)",
    "rgb(20 184 166 / 0.10)",
  ];

  return (
    <div className={className}>
      <div className="relative h-[210px] w-full">
        {/* Labels */}
        <div
          className="pointer-events-none absolute top-2 left-0 right-0 z-10 grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${count}, minmax(0,1fr))`,
            paddingLeft: PLOT_MARGIN.left,
            paddingRight: PLOT_MARGIN.right,
          }}
        >
          {stages.map((s) => (
            <div key={s.status} className="min-w-0">
              <div className="text-sm text-muted-foreground">
                {labelFormatter(s.status)}
              </div>
              <div className="text-sm font-semibold text-white">
                {valueFormatter(s.value)}
              </div>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={PLOT_MARGIN}
            tabIndex={-1}
            role="img"
            aria-label="Funnel"
          >
            {/* Stage background bands */}
            {stages.map((_, i) => (
              <ReferenceArea
                key={`bg-${i}`}
                x1={i}
                x2={i + 1}
                y1={0}
                y2="auto"
                ifOverflow="hidden"
                fill={bands[i % bands.length]}
              />
            ))}

            {/* Dividers */}
            {stages.map((_, i) =>
              i === 0 ? null : (
                <ReferenceLine
                  key={`sep-${i}`}
                  x={i}
                  stroke="rgba(255,255,255,0.12)"
                />
              )
            )}

            <XAxis type="number" dataKey="idx" domain={[0, count - 1]} hide />
            <YAxis type="number" domain={[0, maxValue]} hide />

            <defs>
              <linearGradient id="funnelAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeTeal} stopOpacity={0.35} />
                <stop offset="100%" stopColor={strokeTeal} stopOpacity={0.06} />
              </linearGradient>
            </defs>

            <Tooltip
              content={({ active, label, payload }) => (
                <FunnelGraphTooltip
                  active={active}
                  label={label}
                  payload={payload}
                />
              )}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeTeal}
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
