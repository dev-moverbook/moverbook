"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { ForecastPoint } from "@/types/types";

type UseForecastedAnalyticsLoading = { status: QueryStatus.LOADING };
type UseForecastedAnalyticsError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseForecastedAnalyticsSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: ForecastPoint[] };
};

export type UseForecastedAnalyticsResult =
  | UseForecastedAnalyticsLoading
  | UseForecastedAnalyticsError
  | UseForecastedAnalyticsSuccess;

export const useForecastedAnalytics = (
  companyId: Id<"companies"> | null,
  startDate: string,
  endDate: string,
  salesRepId: Id<"users"> | null,
  referralId: Id<"referrals"> | null
): UseForecastedAnalyticsResult => {
  const response = useQuery(
    api.move.getForecastedAnalytics,
    companyId
      ? {
          companyId,
          startDate,
          endDate,
          salesRepId,
          referralId,
        }
      : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load forecasted analytics.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series as ForecastPoint[] },
  };
};
