"use client";

import type { LineGraphDatum, HistoricalPoint } from "@/types/types";
import LineChartCard from "@/app/components/shared/graphs/lineGraphs/LineChartCard";
import { formatCurrencyCompact } from "@/app/frontendUtils/helper";
import { formatXLabel } from "@/app/frontendUtils/luxonUtils";

type HistoricalAnalyticsSuccessProps = {
  series: HistoricalPoint[];
};

const HistoricalAnalyticsSuccess = ({
  series,
}: HistoricalAnalyticsSuccessProps) => {
  const data: LineGraphDatum[] = Array.isArray(series)
    ? series.map((point) => ({ label: point.date, value: point.revenue }))
    : [];

  return (
    <LineChartCard
      title=" Revenue"
      data={data}
      valueFormatter={formatCurrencyCompact}
      color="#2563EB"
      bodyHeight={240}
      labelFormatter={formatXLabel}
    />
  );
};

export default HistoricalAnalyticsSuccess;
