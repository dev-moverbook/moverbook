// app/hooks/queries/arrival/useCompanyArrival.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseCompanyArrivalLoading = { status: QueryStatus.LOADING };
type UseCompanyArrivalError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseCompanyArrivalSuccess = {
  status: QueryStatus.SUCCESS;
  arrivalWindow: Doc<"arrivalWindow">;
};

export type UseCompanyArrivalResult =
  | UseCompanyArrivalLoading
  | UseCompanyArrivalError
  | UseCompanyArrivalSuccess;

export const useCompanyArrival = (
  companyId: Id<"companies">,
  { enabled = true }: { enabled?: boolean } = {}
): UseCompanyArrivalResult => {
  const response = useQuery(
    api.arrivalWindow.getCompanyArrival,
    enabled ? { companyId } : "skip"
  );

  if (!response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load company arrival window.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    arrivalWindow: response.data.arrivalWindow,
  };
};
