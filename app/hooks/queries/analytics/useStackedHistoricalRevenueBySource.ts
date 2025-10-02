"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { StackedDay } from "@/types/types";

type UseHistoricalBySourceLoading = { status: QueryStatus.LOADING };
type UseHistoricalBySourceError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseHistoricalBySourceSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: StackedDay[] };
};

export type UseStackedHistoricalRevenueBySourceResult =
  | UseHistoricalBySourceLoading
  | UseHistoricalBySourceError
  | UseHistoricalBySourceSuccess;

type Args = {
  companyId: Id<"companies"> | null;
  startDate: string;
  endDate: string;
};

export function useStackedHistoricalRevenueBySource({
  companyId,
  startDate,
  endDate,
}: Args): UseStackedHistoricalRevenueBySourceResult {
  const response = useQuery(
    api.move.getStackedHistoricalRevenueBySource,
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
        response.error ?? "Failed to load historical revenue by source.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series as StackedDay[] },
  };
}
