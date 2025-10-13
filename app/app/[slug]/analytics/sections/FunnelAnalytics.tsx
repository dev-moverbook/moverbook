"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import type { Id } from "@/convex/_generated/dataModel";
import { useFunnel } from "@/app/hooks/queries/analytics/useFunnel";
import FunnelAnalyticsSuccess from "./FunnelAnalyticsSuccess";
import ChartCardSkeletonStatic from "@/app/components/shared/skeleton/ChartCardSkeleton";

interface FunnelAnalyticsProps {
  startDate: string;
  endDate: string;
  salesRepId: Id<"users"> | null;
  referralId: Id<"referrals"> | null;
}

const FunnelAnalytics = ({
  startDate,
  endDate,
  salesRepId,
  referralId,
}: FunnelAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useFunnel({
    companyId,
    startDate,
    endDate,
    salesRepId,
    referralId,
  });

  let body: React.ReactNode = null;

  switch (result) {
    case undefined:
      body = <ChartCardSkeletonStatic />;
      break;
    default:
      body = <FunnelAnalyticsSuccess series={result} />;
      break;
  }

  return <>{body}</>;
};

export default FunnelAnalytics;
