"use client";

import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { QueryStatus } from "@/types/enums";
import { useMoveAnalytics } from "@/app/hooks/queries/analytics/useMoveAnalytics";
import { LocationType, MoveSize, ServiceType } from "@/types/types";
import MoveDataAnalyticsSuccess from "./MoveDataAnalyticsSuccess";

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

  switch (result.status) {
    case QueryStatus.LOADING:
      break;
    case QueryStatus.ERROR:
      body = <ErrorComponent message={result.errorMessage} />;
      break;
    case QueryStatus.SUCCESS:
      body = <MoveDataAnalyticsSuccess series={result.data.series} />;
      break;
  }

  return <>{body}</>;
};

export default MoveDataAnalytics;
