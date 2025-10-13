"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
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

  switch (result) {
    case undefined:
      body = <ChartCardSkeletonStatic />;
      break;
    default:
      body = <HistoricalAnalyticsSuccess series={result} />;
      break;
  }

  return <>{body}</>;
};

export default HistoricalAnalytics;
