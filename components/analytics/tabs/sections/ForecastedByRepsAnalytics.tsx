"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useStackedForecastedRevenueByRep } from "@/hooks/analytics/useStackedForecastedRevenueByRep";
import StackedBarChartCard from "@/components/shared/graphs/stackedBar/StackedBarChartCard";
import { formatCurrency, formatCurrencyCompact } from "@/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/frontendUtils/luxonUtils";

interface ForecastedByRepsAnalyticsProps {
  startDate: string;
  endDate: string;
}

const ForecastedByRepsAnalytics = ({
  startDate,
  endDate,
}: ForecastedByRepsAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useStackedForecastedRevenueByRep({
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
          title="Forecasted Revenue by Rep"
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

export default ForecastedByRepsAnalytics;
