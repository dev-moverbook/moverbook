"use client";

import { toNumberOrZero } from "@/app/frontendUtils/graphHelpers";

type TooltipEntry = {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  value?: number | string | null;
};

type LineGraphTooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: TooltipEntry[];
  labelFormatter: (label: string | number) => string;
  valueFormatter: (value: number) => string;
};

export default function LineGraphTooltip({
  active,
  label,
  payload,
  labelFormatter,
  valueFormatter,
}: LineGraphTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const items = payload.filter(Boolean).map((entry) => ({
    color: entry.color ?? "#ffffff",
    name: String(entry.name ?? entry.dataKey ?? ""),
    value: toNumberOrZero(entry.value),
  }));

  return (
    <div className="rounded-xl bg-neutral-900/90 px-3 py-2 text-sm text-white shadow-xl ring-1 ring-white/10">
      <div className="font-medium opacity-90">
        {labelFormatter(label ?? "")}
      </div>

      <div className="mt-1 space-y-0.5">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="opacity-80">{item.name}:</span>
            <span className="font-semibold">{valueFormatter(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
