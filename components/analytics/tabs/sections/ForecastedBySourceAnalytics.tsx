"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import StackedBarChartCard from "@/components/shared/graphs/stackedBar/StackedBarChartCard";
import { useStackedForecastedRevenueBySource } from "@/hooks/analytics/useStackedForecastedRevenueBySource";
import { formatCurrency, formatCurrencyCompact } from "@/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/frontendUtils/luxonUtils";

interface ForecastedBySourceAnalyticsProps {
  startDate: string;
  endDate: string;
}

const ForecastedBySourceAnalytics = ({
  startDate,
  endDate,
}: ForecastedBySourceAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useStackedForecastedRevenueBySource({
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
          title="Forecasted Revenue by Source"
          series={result}
          valueFormatter={formatCurrencyCompact}
          labelFormatter={formatWeekdayShort}
          tooltipValueFormatter={formatCurrency}
        />
      );
      break;
  }

  return <>{body}</>;
};

export default ForecastedBySourceAnalytics;
