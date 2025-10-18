"use client";

import type { ForecastPoint, LineSeries } from "@/types/types";
import LineChartCard from "@/components/shared/graphs/lineGraphs/LineChartCard";
import { formatCurrency, formatCurrencyCompact } from "@/frontendUtils/helper";
import { formatXLabel } from "@/frontendUtils/luxonUtils";

type ForecastedAnalyticsSuccessProps = {
  series: ForecastPoint[];
};

export default function ForecastedAnalyticsSuccess({
  series,
}: ForecastedAnalyticsSuccessProps) {
  const lineSeries: LineSeries[] = [
    {
      color: "var(--revenue-forecast)",
      data: (Array.isArray(series) ? series : []).map((point) => ({
        label: point.date,
        value: point.revenue,
      })),
      id: "forecast",
      name: "Forecasted Revenue",
    },
  ];

  return (
    <LineChartCard
      bodyHeight={240}
      labelFormatter={formatXLabel}
      series={lineSeries}
      title="Forecasted Revenue"
      valueFormatter={formatCurrencyCompact}
      tooltipValueFormatter={formatCurrency}
    />
  );
}
