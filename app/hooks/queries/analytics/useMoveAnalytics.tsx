"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import type {
  ServiceType,
  MoveSize,
  LocationType,
  MoveAnalyticsPoint,
} from "@/types/types";

type UseMoveAnalyticsLoading = { status: QueryStatus.LOADING };
type UseMoveAnalyticsError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseMoveAnalyticsSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: MoveAnalyticsPoint[] };
};

export type UseMoveAnalyticsResult =
  | UseMoveAnalyticsLoading
  | UseMoveAnalyticsError
  | UseMoveAnalyticsSuccess;

export const useMoveAnalytics = (
  companyId: Id<"companies"> | null,
  startDate: string,
  endDate: string,
  serviceType: ServiceType | null,
  moveSize: MoveSize | null,
  numberOfMovers: number | null,
  locationType: LocationType | null
): UseMoveAnalyticsResult => {
  const response = useQuery(
    api.move.getMoveAnalytics,
    companyId
      ? {
          companyId,
          startDate,
          endDate,
          serviceType,
          moveSize,
          numberOfMovers,
          locationType,
        }
      : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load move analytics.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series },
  };
};
