"use client";

import type { LineSeries, MoveAnalyticsPoint } from "@/types/types";
import LineChartCard from "@/app/components/shared/graphs/lineGraphs/LineChartCard";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatHours,
  formatHoursAbbreviated,
} from "@/app/frontendUtils/helper";
import { formatXLabel } from "@/app/frontendUtils/luxonUtils";

type MoveDataAnalyticsSuccessProps = {
  series: MoveAnalyticsPoint[];
};

export default function MoveDataAnalyticsSuccess({
  series,
}: MoveDataAnalyticsSuccessProps) {
  const averageRevenueSeries: LineSeries[] = [
    {
      color: "var(--revenue-average)",
      data: (Array.isArray(series) ? series : []).map((point) => ({
        label: point.date,
        value: point.averageRevenue,
      })),
      id: "averageRevenue",
      name: "Average Revenue Per Day",
    },
  ];

  const averageMoveTimeSeries: LineSeries[] = [
    {
      color: "var(--average-move-time)",
      data: (Array.isArray(series) ? series : []).map((point) => ({
        label: point.date,
        value: point.averageMoveTimeHours,
      })),
      id: "averageMoveTime",
      name: "Average Move Time Per Day",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <LineChartCard
        bodyHeight={240}
        labelFormatter={formatXLabel}
        series={averageRevenueSeries}
        title="Average Revenue Per Day"
        valueFormatter={formatCurrencyCompact}
        tooltipValueFormatter={formatCurrency}
        yAxisWidth={64}
      />
      <LineChartCard
        bodyHeight={240}
        labelFormatter={formatXLabel}
        series={averageMoveTimeSeries}
        title="Average Move Time Per Day"
        valueFormatter={formatHoursAbbreviated}
        tooltipValueFormatter={formatHours}
        yAxisWidth={64}
      />
    </div>
  );
}
