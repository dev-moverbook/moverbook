"use client";

import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
import { useStackedForecastedRevenueByRep } from "@/app/hooks/queries/analytics/useStackedForecastedRevenueByRep";
import StackedBarChartCard from "@/app/components/shared/graphs/stackedBar/StackedBarChartCard";
import { formatCurrency } from "@/app/frontendUtils/helper";
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

  switch (result.status) {
    case QueryStatus.LOADING:
      body = <ChartCardSkeletonStatic />;
      break;
    case QueryStatus.ERROR:
      body = <ErrorComponent message={result.errorMessage} />;
      break;
    case QueryStatus.SUCCESS:
      body = (
        <StackedBarChartCard
          title="Forecasted Revenue by Rep"
          series={result.data.series}
          valueFormatter={(value) => formatCurrency(value)}
          labelFormatter={formatWeekdayShort}
        />
      );
      break;
  }

  return <>{body}</>;
};

export default ForecastedByRepsAnalytics;
