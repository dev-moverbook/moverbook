"use client";

import TooltipContainer from "../container/TooltipContainer";

type PayloadEntry = {
  value?: number;
  color?: string;
  payload?: {
    status?: string;
  };
};

type FunnelGraphTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: PayloadEntry[];
};

export default function FunnelGraphTooltip({
  active,
  payload = [],
  label,
}: FunnelGraphTooltipProps) {
  if (!active || payload.length === 0) {
    return null;
  }

  const stageName = payload[0].payload?.status ?? String(label ?? "");
  const value = payload[0].value ?? 0;
  const color = payload[0].color ?? "#fff";

  return (
    <TooltipContainer>
      <div className="font-medium opacity-90">{stageName}</div>
      <div className="mt-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="opacity-80">Count:</span>
          <span className="font-semibold">{value.toLocaleString()}</span>
        </div>
      </div>
    </TooltipContainer>
  );
}
