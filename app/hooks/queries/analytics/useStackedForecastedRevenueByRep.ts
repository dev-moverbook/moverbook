"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { StackedDay } from "@/types/types";

type UseForecastedByRepLoading = { status: QueryStatus.LOADING };
type UseForecastedByRepError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseForecastedByRepSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: StackedDay[] };
};

export type UseStackedForecastedRevenueByRepResult =
  | UseForecastedByRepLoading
  | UseForecastedByRepError
  | UseForecastedByRepSuccess;

type Args = {
  companyId: Id<"companies"> | null;
  startDate: string;
  endDate: string;
};

export function useStackedForecastedRevenueByRep({
  companyId,
  startDate,
  endDate,
}: Args): UseStackedForecastedRevenueByRepResult {
  const response = useQuery(
    api.move.getStackedForecastedRevenueByRep,
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
        response.error ?? "Failed to load forecasted revenue by rep.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series },
  };
}
