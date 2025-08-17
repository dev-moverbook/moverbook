"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseGetSalesRepsLoading = { status: QueryStatus.LOADING };
type UseGetSalesRepsError = { status: QueryStatus.ERROR; errorMessage: string };
type UseGetSalesRepsSuccess = {
  status: QueryStatus.SUCCESS;
  data: Doc<"users">[];
};

export type UseGetSalesRepsResult =
  | UseGetSalesRepsLoading
  | UseGetSalesRepsError
  | UseGetSalesRepsSuccess;

export const useGetSalesReps = (
  companyId: Id<"companies"> | null
): UseGetSalesRepsResult => {
  const response = useQuery<typeof api.users.getSalesRepsByCompanyId>(
    api.users.getSalesRepsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load sales reps.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data.users,
  };
};
