"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
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
