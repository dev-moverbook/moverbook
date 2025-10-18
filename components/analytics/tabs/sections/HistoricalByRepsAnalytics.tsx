"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import StackedBarChartCard from "@/components/shared/graphs/stackedBar/StackedBarChartCard";
import { useStackedHistoricalRevenueByRep } from "@/hooks/analytics";
import { formatCurrency, formatCurrencyCompact } from "@/frontendUtils/helper";
import ChartCardSkeletonStatic from "@/components/shared/skeleton/ChartCardSkeleton";
import { formatWeekdayShort } from "@/frontendUtils/luxonUtils";

interface HistoricalByRepsAnalyticsProps {
  startDate: string;
  endDate: string;
}

const HistoricalByRepsAnalytics = ({
  startDate,
  endDate,
}: HistoricalByRepsAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useStackedHistoricalRevenueByRep({
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
          title="Revenue by Rep"
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

export default HistoricalByRepsAnalytics;
