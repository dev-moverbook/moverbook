"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { StackedDay } from "@/types/types";

type UseHistoricalByRepLoading = { status: QueryStatus.LOADING };
type UseHistoricalByRepError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseHistoricalByRepSuccess = {
  status: QueryStatus.SUCCESS;
  data: { series: StackedDay[] };
};

export type UseStackedHistoricalRevenueByRepResult =
  | UseHistoricalByRepLoading
  | UseHistoricalByRepError
  | UseHistoricalByRepSuccess;

type Args = {
  companyId: Id<"companies"> | null;
  startDate: string;
  endDate: string;
};

export function useStackedHistoricalRevenueByRep({
  companyId,
  startDate,
  endDate,
}: Args): UseStackedHistoricalRevenueByRepResult {
  const response = useQuery(
    api.move.getStackedHistoricalRevenueByRep,
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
        response.error ?? "Failed to load historical revenue by rep.",
    };
  }

  console.log("response.data.series", response.data.series);

  return {
    status: QueryStatus.SUCCESS,
    data: { series: response.data.series },
  };
}
