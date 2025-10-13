"use client";

import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
import { useMoveAnalytics } from "@/app/hooks/queries/analytics/useMoveAnalytics";
import { LocationType, MoveSize, ServiceType } from "@/types/types";
import MoveDataAnalyticsSuccess from "./MoveDataAnalyticsSuccess";
import ChartCardSkeletonStatic from "@/app/components/shared/skeleton/ChartCardSkeleton";

interface MoveDataAnalyticsProps {
  startDate: string;
  endDate: string;
  serviceType: ServiceType | null;
  numberOfMovers: number | null;
  locationType: LocationType | null;
  moveSize: MoveSize | null;
}

const MoveDataAnalytics = ({
  startDate,
  endDate,
  serviceType,
  numberOfMovers,
  locationType,
  moveSize,
}: MoveDataAnalyticsProps) => {
  const { companyId } = useSlugContext();

  const result = useMoveAnalytics(
    companyId,
    startDate,
    endDate,
    serviceType,
    moveSize,
    numberOfMovers,
    locationType
  );

  let body: React.ReactNode = null;

  switch (result) {
    case undefined:
      body = (
        <div className="flex flex-col gap-4">
          <ChartCardSkeletonStatic />
          <ChartCardSkeletonStatic />
        </div>
      );
      break;
    default:
      body = <MoveDataAnalyticsSuccess series={result} />;
      break;
  }

  return <>{body}</>;
};

export default MoveDataAnalytics;
