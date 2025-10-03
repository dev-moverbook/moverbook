"use client";

import { toNumberOrZero } from "@/app/frontendUtils/graphHelpers";
import TooltipContainer from "../container/TooltipContainer";
import { formatWeekdayShortWithDate } from "@/app/frontendUtils/luxonUtils";

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
  valueFormatter: (value: number) => string;
};

export default function LineGraphTooltip({
  active,
  label,
  payload,
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

  const headerLabel: string =
    typeof label === "string"
      ? formatWeekdayShortWithDate(label)
      : String(label);

  return (
    <TooltipContainer>
      <div className="font-medium opacity-90">{headerLabel}</div>

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
    </TooltipContainer>
  );
}
