"use client";

import type { LineGraphDatum, MoveAnalyticsPoint } from "@/types/types";
import LineChartCard from "@/app/components/shared/graphs/lineGraphs/LineChartCard";
import { formatCurrencyCompact } from "@/app/frontendUtils/helper";
import { formatXLabel } from "@/app/frontendUtils/luxonUtils";

type MoveDataAnalyticsSuccessProps = {
  series: MoveAnalyticsPoint[];
};

const MoveDataAnalyticsSuccess = ({
  series,
}: MoveDataAnalyticsSuccessProps) => {
  const averageRevenueData: LineGraphDatum[] = Array.isArray(series)
    ? series.map((point) => ({
        label: point.date,
        value: point.averageRevenue,
      }))
    : [];

  const averageMoveTimeData: LineGraphDatum[] = Array.isArray(series)
    ? series.map((point) => ({
        label: point.date,
        value: point.averageMoveTimeHours,
      }))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <LineChartCard
        title="Average Revenue"
        data={averageRevenueData}
        valueFormatter={formatCurrencyCompact}
        color="#2563EB"
        bodyHeight={240}
        labelFormatter={formatXLabel}
      />
      <LineChartCard
        title="Average Move Time"
        data={averageMoveTimeData}
        valueFormatter={formatCurrencyCompact}
        color="#2563EB"
        bodyHeight={240}
        labelFormatter={formatXLabel}
      />
    </div>
  );
};

export default MoveDataAnalyticsSuccess;
