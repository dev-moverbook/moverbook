"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { HistoricalPoint } from "@/types/types";

type UseHistoricalAnalyticsLoading = { status: QueryStatus.LOADING };
type UseHistoricalAnalyticsError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseHistoricalAnalyticsSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: HistoricalPoint[] };
};

export type UseHistoricalAnalyticsResult =
  | UseHistoricalAnalyticsLoading
  | UseHistoricalAnalyticsError
  | UseHistoricalAnalyticsSuccess;

export const useHistoricalAnalytics = (
  companyId: Id<"companies"> | null,
  startDate: string,
  endDate: string,
  salesRepId: Id<"users"> | null,
  referralId: Id<"referrals"> | null
): UseHistoricalAnalyticsResult => {
  const response = useQuery(
    api.move.getHistoricalAnalytics,
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
      errorMessage: response.error ?? "Failed to load historical analytics.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series },
  };
};
