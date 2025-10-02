"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { StackedDay } from "@/types/types";

type UseForecastedBySourceLoading = { status: QueryStatus.LOADING };
type UseForecastedBySourceError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseForecastedBySourceSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: StackedDay[] };
};

export type UseStackedForecastedRevenueBySourceResult =
  | UseForecastedBySourceLoading
  | UseForecastedBySourceError
  | UseForecastedBySourceSuccess;

type Args = {
  companyId: Id<"companies"> | null;
  startDate: string;
  endDate: string;
};

export function useStackedForecastedRevenueBySource({
  companyId,
  startDate,
  endDate,
}: Args): UseStackedForecastedRevenueBySourceResult {
  const response = useQuery(
    api.move.getStackedForecastedRevenueBySource,
    companyId
      ? {
          companyId,
          startDate,
          endDate,
        }
      : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage:
        response.error ?? "Failed to load forecasted revenue by source.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series },
  };
}
