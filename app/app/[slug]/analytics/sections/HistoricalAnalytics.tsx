"use client";

import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
import type { Id } from "@/convex/_generated/dataModel";
import { useHistoricalAnalytics } from "@/app/hooks/queries/analytics/useHistoricalAnalytics";
import HistoricalAnalyticsSuccess from "./HistoricalAnalyticsSuccess";
import ChartCardSkeletonStatic from "@/app/components/shared/skeleton/ChartCardSkeleton";

interface HistoricalAnalyticsProps {
  startDate: string;
  endDate: string;
  salesRepId: Id<"users"> | null;
  referralId: Id<"referrals"> | null;
}

const HistoricalAnalytics = ({
  startDate,
  endDate,
  salesRepId,
  referralId,
}: HistoricalAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useHistoricalAnalytics(
    companyId,
    startDate,
    endDate,
    salesRepId,
    referralId
  );

  let body: React.ReactNode = null;

  switch (result.status) {
    case QueryStatus.LOADING:
      body = <ChartCardSkeletonStatic />;
      break;
    case QueryStatus.ERROR:
      body = <ErrorComponent message={result.errorMessage} />;
      break;
    case QueryStatus.SUCCESS:
      body = <HistoricalAnalyticsSuccess series={result.data.series} />;
      break;
  }

  return <>{body}</>;
};

export default HistoricalAnalytics;
