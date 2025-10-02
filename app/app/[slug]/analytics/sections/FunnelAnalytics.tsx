"use client";

import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
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

  switch (result.status) {
    case QueryStatus.LOADING:
      body = <ChartCardSkeletonStatic />;
      break;
    case QueryStatus.ERROR:
      body = <ErrorComponent message={result.errorMessage} />;
      break;
    case QueryStatus.SUCCESS:
      body = <FunnelAnalyticsSuccess series={result.data.funnel} />;
      break;
  }

  return <>{body}</>;
};

export default FunnelAnalytics;
