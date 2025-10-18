"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import type { Id } from "@/convex/_generated/dataModel";
import { useHistoricalAnalytics } from "@/hooks/analytics";
import HistoricalAnalyticsSuccess from "./HistoricalAnalyticsSuccess";
import ChartCardSkeletonStatic from "@/components/shared/skeleton/ChartCardSkeleton";

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
