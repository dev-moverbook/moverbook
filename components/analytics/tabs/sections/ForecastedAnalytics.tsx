"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useForecastedAnalytics } from "@/hooks/analytics";
import type { Id } from "@/convex/_generated/dataModel";
import ForecastedAnalyticsSuccess from "./ForecastedAnalyticsSuccess";
import ChartCardSkeletonStatic from "@/components/shared/skeleton/ChartCardSkeleton";

interface ForecastedAnalyticsProps {
  startDate: string;
  endDate: string;
  salesRepId: Id<"users"> | null;
  referralId: Id<"referrals"> | null;
}

const ForecastedAnalytics = ({
  startDate,
  endDate,
  salesRepId,
  referralId,
}: ForecastedAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useForecastedAnalytics(
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
      body = <ForecastedAnalyticsSuccess series={result} />;
      break;
  }

  return <>{body}</>;
};

export default ForecastedAnalytics;
