"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import StackedBarChartCard from "@/components/shared/graphs/stackedBar/StackedBarChartCard";
import { useStackedHistoricalRevenueBySource } from "@/hooks/analytics";
import { formatCurrency, formatCurrencyCompact } from "@/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/frontendUtils/luxonUtils";

interface HistoricalBySourceAnalyticsProps {
  startDate: string;
  endDate: string;
}

const HistoricalBySourceAnalytics = ({
  startDate,
  endDate,
}: HistoricalBySourceAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useStackedHistoricalRevenueBySource({
    companyId,
    startDate,
    endDate,
  });

  let body: React.ReactNode = null;

  switch (result) {
    case undefined:
      body = <ChartCardSkeletonStatic />;
      break;
    default:
      body = (
        <StackedBarChartCard
          title="Revenue by Source"
          series={result}
          labelFormatter={formatWeekdayShort}
          valueFormatter={formatCurrencyCompact}
          tooltipValueFormatter={formatCurrency}
        />
      );
      break;
  }

  return <>{body}</>;
};

export default HistoricalBySourceAnalytics;
