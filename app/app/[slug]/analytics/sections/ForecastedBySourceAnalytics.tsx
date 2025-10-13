"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import StackedBarChartCard from "@/app/components/shared/graphs/stackedBar/StackedBarChartCard";
import { useStackedForecastedRevenueBySource } from "@/app/hooks/queries/analytics/useStackedForecastedRevenueBySource";
import {
  formatCurrency,
  formatCurrencyCompact,
} from "@/app/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/app/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/app/frontendUtils/luxonUtils";

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
