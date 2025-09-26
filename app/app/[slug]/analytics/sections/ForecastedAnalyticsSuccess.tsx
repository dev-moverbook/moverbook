"use client";

import type { LineGraphDatum, ForecastPoint } from "@/types/types";
import LineChartCard from "@/app/components/shared/graphs/lineGraphs/LineChartCard";
import { formatCurrencyCompact } from "@/app/frontendUtils/helper";
import { formatXLabel } from "@/app/frontendUtils/luxonUtils";

type ForecastedAnalyticsSuccessProps = {
  series: ForecastPoint[];
};

const ForecastedAnalyticsSuccess = ({
  series,
}: ForecastedAnalyticsSuccessProps) => {
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

export default ForecastedAnalyticsSuccess;
