"use client";

import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
import StackedBarChartCard from "@/app/components/shared/graphs/stackedBar/StackedBarChartCard";
import { useStackedHistoricalRevenueBySource } from "@/app/hooks/queries/analytics/useStackedHistoricalRevenueBySource";
import {
  formatCurrency,
  formatCurrencyCompact,
} from "@/app/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/app/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/app/frontendUtils/luxonUtils";

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
          title="Revenue by Source"
          series={result.data.series}
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
