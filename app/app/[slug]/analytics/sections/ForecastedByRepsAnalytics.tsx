"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import { useStackedForecastedRevenueByRep } from "@/app/hooks/queries/analytics/useStackedForecastedRevenueByRep";
import StackedBarChartCard from "@/app/components/shared/graphs/stackedBar/StackedBarChartCard";
import {
  formatCurrency,
  formatCurrencyCompact,
} from "@/app/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/app/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/app/frontendUtils/luxonUtils";

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
