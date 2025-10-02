"use client";

import type { HistoricalPoint, LineSeries } from "@/types/types";
import LineChartCard from "@/app/components/shared/graphs/lineGraphs/LineChartCard";
import {
  formatCurrency,
  formatCurrencyCompact,
} from "@/app/frontendUtils/helper";
import { formatXLabel } from "@/app/frontendUtils/luxonUtils";
import {
  mapPointsToLineData,
  sortByDateAscending,
} from "@/app/frontendUtils/graphHelpers";

type HistoricalAnalyticsSuccessProps = {
  series: HistoricalPoint[];
};

export default function HistoricalAnalyticsSuccess({
  series,
}: HistoricalAnalyticsSuccessProps) {
  const sortedPoints = Array.isArray(series) ? sortByDateAscending(series) : [];

  const lineSeries: LineSeries[] = [
    {
      color: "var(--revenue-historical)",
      data: mapPointsToLineData(sortedPoints, "revenue"),
      id: "revenue",
      name: "Revenue",
    },
    {
      color: "var(--profit)",
      data: mapPointsToLineData(sortedPoints, "profit"),
      id: "profit",
      name: "Profit",
    },
  ];

  return (
    <LineChartCard
      bodyHeight={240}
      labelFormatter={formatXLabel}
      series={lineSeries}
      title="Revenue & Profit"
      valueFormatter={formatCurrencyCompact}
      tooltipValueFormatter={formatCurrency}
    />
  );
}
